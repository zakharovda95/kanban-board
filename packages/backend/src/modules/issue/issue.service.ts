import {
  EStorageSubmodule,
  EStorageUploadStatus,
  type TCreateIssue,
  type TDeleteIssueEmitPayload,
  type TIssue,
  type TIssueBase,
  type TMoveIssue,
  type TMoveIssueEmitPayload,
  type TMoveOptions,
  type TMoveParameters,
  type TStorageUploadData,
  type TStorageUploadMeta,
  type TUpdateIssue,
} from '@kanban-board/common';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DataSource } from 'typeorm';

import StorageService from '@/infrastructure/storage/storage.service';
import type { TMaxOrderResult } from '@/libs/utilities/order.utility';
import OrderUtility from '@/libs/utilities/order.utility';
import ColumnEntity from '@/modules/column/libs/entities/column.entity';
import IssueEntity from '@/modules/issue/libs/entities/issue.entity';
import IssueAttachmentEntity from '@/modules/issue/libs/entities/issue-attachment.entity';
import IssueMapper from '@/modules/issue/libs/mappers/issue.mapper';
import MoveService from '@/modules/shared/move/move.service';

@Injectable()
export class IssueService {
  constructor(
    private dataSource: DataSource,
    private issueMapper: IssueMapper,
    private moveService: MoveService<IssueEntity>,
    private storageService: StorageService,
  ) {}

  /**
   * Получить задачу по id.
   * @param issueId - id задачи.
   * @returns объект задачи.
   * **/
  public async getIssueById(issueId: number): Promise<TIssue> {
    const { manager } = this.dataSource;

    const issue = await manager.findOne(IssueEntity, { where: { id: issueId } });
    if (!issue) throw new NotFoundException('Задача с указанным идентификатором не найдена');

    return this.issueMapper.toModel(issue, { base: false });
  }

  /**
   * Создать задачу в колонке.
   * @param body - данные задачи (boardId, columnId, title, description).
   * @returns объект созданной задачи.
   * **/
  public async createIssue(body: TCreateIssue): Promise<TIssueBase> {
    if (!body) throw new WsException('Не переданы данные, необходимые для создания задачи');

    const { boardId, columnId, title, description } = body;
    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1002;
      // Блокируем доступ к базе данных для предотвращения одновременного создания нескольких задач.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1, $2)', [
        DATABASE_LOCK_ID,
        columnId,
      ]);

      const isExists = await transactionalManager.exists(ColumnEntity, {
        where: { id: columnId, boardId },
      });
      if (!isExists)
        throw new WsException('Не удалось создать задачу: указанная колонка на доске не найдена');

      const result = await transactionalManager
        .createQueryBuilder()
        .select('MAX(issue.order)', 'maxOrder')
        .from(IssueEntity, 'issue')
        .where('issue.columnId = :columnId', { columnId })
        .getRawOne<TMaxOrderResult>();

      const createdIssue = await transactionalManager.save(IssueEntity, {
        title,
        description: description ?? null,
        order: OrderUtility.calculateNextOrder(result?.maxOrder ?? 0),
        boardId,
        columnId,
      });
      if (!createdIssue) throw new WsException('Не удалось сохранить задачу в базе данных');

      return this.issueMapper.toModel(createdIssue, { base: true });
    });
  }

  /**
   * Переместить задачу.
   * Правила перемещения:
   * - Если указан toColumnId - задача перемещается в указанную колонку.
   * - Если не указан toColumnId - перемещение в рамках текущей колонки.
   * - Должен быть указан previousId - id задачи после которой будет помещена целевая задача.
   * - Если previousId - null - задача помещается в начало.
   * - При перемещении задачи в другую ПУСТУЮ колонку необходимо указать previousId в значении null (иначе ошибка).
   * - Если при перемещении задачи ее позиция на доске не меняется (та же колонка та же позиция), то она не может быть перемещена.
   * - Задача не может быть перемещена на другую доску.
   * @param body - параметры перемещения (previousId, targetId, fromColumnId, toColumnId, boardId).
   * @returns ID перемещенной задачи, ID колонки from/to и перемещенная задача или null, если был reorder и нужен refetch.
   * **/
  public async moveIssue(body: TMoveIssue): Promise<TMoveIssueEmitPayload> {
    if (!body) throw new WsException('Не переданы данные, необходимые для перемещения задачи');

    const { toColumnId, previousId, targetId, boardId, fromColumnId } = body;
    const { manager } = this.dataSource;

    return await manager.transaction(async transactionalManager => {
      const targetIssue = await transactionalManager.findOne(IssueEntity, {
        where: { boardId, id: targetId, columnId: fromColumnId },
      });
      if (!targetIssue)
        throw new WsException(
          'Не удалось переместить задачу: задача с указанным идентификатором не найдена',
        );

      const isCurrentBoard = Boolean(targetIssue.boardId === boardId);
      const isCurrentColumn = Boolean(!toColumnId || toColumnId === targetIssue.columnId);
      const columnIdTo = toColumnId || targetIssue.columnId;

      if (!isCurrentBoard)
        throw new WsException(
          'Не удалось переместить задачу: перемещение на другую доску недоступно',
        );

      const targetColumn = await transactionalManager.findOne(ColumnEntity, {
        relations: { issues: true },
        where: { id: columnIdTo, boardId },
        order: { issues: { order: 'ASC' } },
      });
      if (!targetColumn)
        throw new WsException('Не удалось переместить задачу: целевая колонка не найдена');

      const moveParameters: TMoveParameters = { previousId, targetId };
      const moveOptions: TMoveOptions = { allowForceMove: !isCurrentColumn };

      const issuesWithTarget = isCurrentColumn
        ? targetColumn.issues
        : [...targetColumn.issues, targetIssue];

      if (!isCurrentColumn) targetIssue.columnId = columnIdTo;

      const moveResult = this.moveService.tryToMove(issuesWithTarget, moveParameters, moveOptions);
      await transactionalManager.save(IssueEntity, issuesWithTarget);

      let movedIssue: TIssueBase | null = null;

      if (!moveResult.isOrderWasNormalized) {
        const movedIssueEntity = await transactionalManager.findOne(IssueEntity, {
          where: { id: targetId },
        });
        if (movedIssueEntity)
          movedIssue = this.issueMapper.toModel(movedIssueEntity, { base: true });
      }

      return {
        boardId,
        movedIssueId: targetId,
        columnIdFrom: fromColumnId,
        columnIdTo,
        movedIssue,
      };
    });
  }

  /**
   * Частично обновить задачу.
   * @param body - поля для обновления.
   * @returns базовый объект обновленной задачи.
   * **/
  public async updateIssue(body: TUpdateIssue): Promise<TIssueBase> {
    if (!body) throw new WsException('Не переданы данные, необходимые для обновления задачи');

    const { id, ...rest } = body;
    const { manager } = this.dataSource;

    const issue = await manager.findOne(IssueEntity, { where: { id } });
    if (!issue)
      throw new WsException(
        'Не удалось обновить задачу: задача с указанным идентификатором не найдена',
      );

    const updatedIssue = await manager.save(IssueEntity, Object.assign(issue, rest));
    if (!updatedIssue) throw new WsException('Не удалось сохранить изменения задачи в базе данных');

    return this.issueMapper.toModel(updatedIssue, { base: true });
  }

  /**
   * Удалить задачу.
   * @param issueId - id задачи.
   * @returns ID удаленной задачи, ID доски и ID колонки.
   * **/
  public async deleteIssue(issueId: number): Promise<TDeleteIssueEmitPayload> {
    if (!issueId)
      throw new WsException('Не передан идентификатор, необходимый для удаления задачи');

    const { manager } = this.dataSource;

    const target = await manager.findOne(IssueEntity, { where: { id: issueId } });
    if (!target)
      throw new WsException(
        'Не удалось удалить задачу: задача с указанным идентификатором не найдена',
      );

    const { affected } = await manager.delete(IssueEntity, { id: issueId });
    if (!affected || affected <= 0)
      throw new WsException('Не удалось удалить задачу из базы данных');

    return {
      boardId: target.boardId,
      columnId: target.columnId,
      deletedIssueId: target.id,
    };
  }

  /**
   * Загрузить файлы в хранилище.
   * @param body - метаданные файлов.
   * @returns массив объектов с данными о загруженных файлах.
   * **/
  public async uploadIssueAttachments(body: TStorageUploadMeta[]): Promise<TStorageUploadData[]> {
    if (!body || !body?.length)
      throw new NotFoundException(
        'Не переданы метаданные, необходимые для инициализации загрузки вложений задачи',
      );

    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1003;
      // Блокируем доступ к базе данных для предотвращения одновременного создания нескольких пачек файлов.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1)', [DATABASE_LOCK_ID]);

      const savedIssueAttachments = await transactionalManager.save(
        IssueAttachmentEntity,
        body.map(attachmentMeta => ({
          clientId: attachmentMeta.clientId,
          objectKey: this.storageService.buildObjectKey(
            EStorageSubmodule.ISSUE_ATTACHMENTS,
            attachmentMeta.fileName,
          ),
          fileName: attachmentMeta.fileName,
          mimeType: attachmentMeta.mimeType,
          size: attachmentMeta.size,
          status: EStorageUploadStatus.PENDING,
          issueId: null,
        })),
      );

      if (!savedIssueAttachments?.length)
        throw new InternalServerErrorException(
          'Не удалось сохранить метаданные вложений и сформировать ссылки для загрузки',
        );

      return Promise.all(
        savedIssueAttachments.map(async attachment => ({
          clientId: attachment.clientId,
          attachmentId: attachment.id,
          uploadUrl: await this.storageService.getUploadUrl(
            attachment.objectKey,
            attachment.mimeType,
          ),
        })),
      );
    });
  }
}
