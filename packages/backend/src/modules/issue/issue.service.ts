import type {
  TCreateIssue,
  TDeleteIssueEmitPayload,
  TIssue,
  TIssueBase,
  TMoveIssue,
  TMoveIssueEmitPayload,
  TMoveOptions,
  TMoveParameters,
  TUpdateIssue,
} from '@kanban-board/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import type { TMaxOrderResult } from '@/libs/utilities/order.utility';
import OrderUtility from '@/libs/utilities/order.utility';
import ColumnEntity from '@/modules/column/libs/entities/column.entity';
import IssueEntity from '@/modules/issue/libs/entities/issue.entity';
import IssueMapper from '@/modules/issue/libs/mappers/issue.mapper';
import MoveService from '@/modules/shared/move/move.service';

@Injectable()
export default class IssueService {
  constructor(
    private dataSource: DataSource,
    private issueMapper: IssueMapper,
    private moveService: MoveService<IssueEntity>,
  ) {}

  /**
   * Получить задачу по id.
   * @param issueId - id задачи.
   * @returns объект задачи.
   * **/
  public async getIssueById(issueId: number): Promise<TIssue> {
    const { manager } = this.dataSource;

    const issue = await manager.findOne(IssueEntity, { where: { id: issueId } });
    if (!issue) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    return this.issueMapper.toModel(issue, { base: false });
  }

  /**
   * Создать задачу в колонке.
   * @param body - данные задачи (boardId, columnId, title, description).
   * @returns объект созданной задачи.
   * **/
  public async createIssue(body: TCreateIssue): Promise<TIssueBase> {
    if (!body) throw new WsException(EXCEPTION_MESSAGES.requestBodyNotFound);

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
      if (!isExists) throw new WsException(EXCEPTION_MESSAGES.createFailed);

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
      if (!createdIssue) throw new WsException(EXCEPTION_MESSAGES.createFailed);

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
    if (!body) throw new WsException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { toColumnId, previousId, targetId, boardId, fromColumnId } = body;
    const { manager } = this.dataSource;

    return await manager.transaction(async transactionalManager => {
      const targetIssue = await transactionalManager.findOne(IssueEntity, {
        where: { boardId, id: targetId, columnId: fromColumnId },
      });
      if (!targetIssue) throw new WsException(EXCEPTION_MESSAGES.notFound);

      const isCurrentBoard = Boolean(targetIssue.boardId === boardId);
      const isCurrentColumn = Boolean(!toColumnId || toColumnId === targetIssue.columnId);
      const columnIdTo = toColumnId || targetIssue.columnId;

      if (!isCurrentBoard) throw new WsException(EXCEPTION_MESSAGES.moveFailed);

      const targetColumn = await transactionalManager.findOne(ColumnEntity, {
        relations: { issues: true },
        where: { id: columnIdTo, boardId },
        order: { issues: { order: 'ASC' } },
      });
      if (!targetColumn) throw new WsException(EXCEPTION_MESSAGES.notFound);

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
    if (!body) throw new WsException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { id, ...rest } = body;
    const { manager } = this.dataSource;

    const issue = await manager.findOne(IssueEntity, { where: { id } });
    if (!issue) throw new WsException(EXCEPTION_MESSAGES.notFound);

    const updatedIssue = await manager.save(IssueEntity, Object.assign(issue, rest));
    if (!updatedIssue) throw new WsException(EXCEPTION_MESSAGES.updateFailed);

    return this.issueMapper.toModel(updatedIssue, { base: true });
  }

  /**
   * Удалить задачу.
   * @param issueId - id задачи.
   * @returns ID удаленной задачи, ID доски и ID колонки.
   * **/
  public async deleteIssue(issueId: number): Promise<TDeleteIssueEmitPayload> {
    if (!issueId) throw new WsException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;

    const target = await manager.findOne(IssueEntity, { where: { id: issueId } });
    if (!target) throw new WsException(EXCEPTION_MESSAGES.notFound);

    const { affected } = await manager.delete(IssueEntity, { id: issueId });
    if (!affected || affected <= 0) throw new WsException(EXCEPTION_MESSAGES.deleteFailed);

    return {
      boardId: target.boardId,
      columnId: target.columnId,
      deletedIssueId: target.id,
    };
  }
}
