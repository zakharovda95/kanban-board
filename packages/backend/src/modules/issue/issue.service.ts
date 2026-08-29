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
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { OrderUtility } from '@/libs/utilities/order.utility';
import { ColumnMapper } from '@/modules/column/column.mapper';
import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import { IssueMapper } from '@/modules/issue/issue.mapper';
import { IssueEntity } from '@/modules/issue/libs/entities/issue.entity';
import { MoveService } from '@/modules/shared/move/move.service';

@Injectable()
export class IssueService {
  constructor(
    private dataSource: DataSource,
    private issueMapper: IssueMapper,
    private columnMapper: ColumnMapper,
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

    const isExists = await manager.exists(ColumnEntity, { where: { id: columnId, boardId } });
    if (!isExists) throw new WsException(EXCEPTION_MESSAGES.createFailed);

    const issuesCount = await manager.count(IssueEntity, { where: { columnId } });

    const createdIssue = await manager.save(IssueEntity, {
      title,
      description: description ?? null,
      order: OrderUtility.calculateOrderByIndex(issuesCount),
      boardId,
      columnId,
    });
    if (!createdIssue) throw new WsException(EXCEPTION_MESSAGES.createFailed);

    return this.issueMapper.toModel(createdIssue, { base: true });
  }

  /**
   * Переместить задачу.
   * Правила перемещения:
   * - Если указан toColumnId - задача перемещается в указанную колонку.
   * - Если не указан toColumnId - перемещение в рамках текущей колонки.
   * - Должен быть указан previousId - id задачи перед которой будет помещена целевая задача.
   * - Если previousId - null - задача помещается в начало.
   * - При перемещении задачи в другую ПУСТУЮ колонку необходимо указать previousId в значении null (иначе ошибка).
   * - Если при перемещении задачи ее позиция на доске не меняется (та же колонка та же позиция), то она не может быть перемещена.
   * - Задача не может быть перемещена на другую доску.
   * @param body - параметры перемещения (previousId, targetId, fromColumnId, toColumnId, boardId).
   * @returns id перемещенной задачи и колонка, куда была перемещена задача.
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
      const actualColumnId = toColumnId || targetIssue.columnId;

      if (!isCurrentBoard) throw new WsException(EXCEPTION_MESSAGES.moveFailed);

      const targetColumn = await transactionalManager.findOne(ColumnEntity, {
        relations: { issues: true },
        where: { id: actualColumnId, boardId },
        order: { issues: { order: 'ASC' } },
      });
      if (!targetColumn) throw new WsException(EXCEPTION_MESSAGES.notFound);

      const moveParameters: TMoveParameters = { previousId, targetId };
      const moveOptions: TMoveOptions = { allowForceMove: !isCurrentColumn };

      const issuesWithTarget = isCurrentColumn
        ? targetColumn.issues
        : [...targetColumn.issues, targetIssue];

      if (!isCurrentColumn) targetIssue.columnId = actualColumnId;

      this.moveService.tryToMove(issuesWithTarget, moveParameters, moveOptions);
      await transactionalManager.save(IssueEntity, issuesWithTarget);

      const targetColumnAfterMove = await transactionalManager.findOne(ColumnEntity, {
        relations: { issues: true },
        where: { id: actualColumnId, boardId },
        order: { issues: { order: 'ASC' } },
      });
      if (!targetColumnAfterMove) throw new WsException(EXCEPTION_MESSAGES.notFound);

      return {
        boardId,
        columnId: actualColumnId,
        movedIssueId: targetId,
        column: this.columnMapper.toModel(targetColumnAfterMove),
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
   * @returns ID удаленной задачи и массив базовых объектов задач после reorder.
   * **/
  public async deleteIssue(issueId: number): Promise<TDeleteIssueEmitPayload> {
    if (!issueId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const target = await transactionalManager.findOne(IssueEntity, { where: { id: issueId } });
      if (!target) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

      const issues = await transactionalManager.find(IssueEntity, {
        where: { columnId: target.columnId, boardId: target.boardId },
        order: { order: 'ASC' },
      });

      const { affected } = await transactionalManager.delete(IssueEntity, { id: issueId });
      if (!affected || affected <= 0)
        throw new InternalServerErrorException(EXCEPTION_MESSAGES.deleteFailed);

      const withoutTarget = issues.filter(({ id }) => id !== issueId);
      this.moveService.resetOrders(withoutTarget);

      await transactionalManager.save(IssueEntity, withoutTarget);

      const issuesAfterDeleting = await transactionalManager.find(IssueEntity, {
        where: { columnId: target.columnId, boardId: target.boardId },
        order: { order: 'ASC' },
      });

      return {
        boardId: target.boardId,
        columnId: target.columnId,
        deletedIssueId: target.id,
        issues: this.issueMapper.toModel(issuesAfterDeleting, { base: true }),
      };
    });
  }
}
