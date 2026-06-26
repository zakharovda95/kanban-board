import type { TSuccessResponse } from '@kanban-board/common';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { OrderUtility } from '@/libs/utilities/order.utility';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import { IssueMapper } from '@/modules/issue/issue.mapper';
import { IssueEntity } from '@/modules/issue/libs/entities/issue.entity';
import type {
  TCreateIssue,
  TCreateIssueResponse,
  TIssue,
  TMoveIssue,
  TPatchIssue,
} from '@/modules/issue/libs/types/issue.types';
import { TMoveOptions, TMoveParameters } from '@/modules/shared/move/libs/types/move.types';
import { MoveService } from '@/modules/shared/move/move.service';

@Injectable()
export class IssueService {
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

    return this.issueMapper.toModel(issue);
  }

  /**
   * Создать задачу в колонке.
   * @param boardId - id доски.
   * @param columnId - id колонки.
   * @param body - данные задачи (title, description).
   * @returns стандартный успешный ответ с id созданной задачи.
   * **/
  public async createIssue(
    boardId: number,
    columnId: number,
    body: TCreateIssue,
  ): Promise<TCreateIssueResponse> {
    if (!boardId || !columnId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const isExists = await manager.exists(ColumnEntity, { where: { id: columnId, boardId } });
    if (!isExists) throw new BadRequestException(EXCEPTION_MESSAGES.createFailed);

    const issuesCount = await manager.count(IssueEntity, { where: { columnId } });

    const { id } = await manager.save(IssueEntity, {
      title: body.title,
      description: body?.description ?? null,
      order: OrderUtility.calculateOrderByIndex(issuesCount),
      boardId,
      columnId,
    });
    if (!id) throw new InternalServerErrorException(EXCEPTION_MESSAGES.createFailed);

    return getSuccessResponseWithData({ id });
  }

  /**
   * Переместить задачу.
   * Правила перемещения:
   * - Если указан toColumnId - задача перемещается в указанную колонку.
   * - Если не указан toColumnId - перемещение в рамках текущей колонки.
   * - Должен быть указаны только previousId или nextId, но не оба сразу.
   * - Если previousId - null - задача помещается в начало.
   * - Если nextId - null - задача помещается в конец.
   * - При перемещении задачи в другую ПУСТУЮ колонку необходимо указать previousId или nextId в значении null (иначе ошибка).
   * - Если существует только одна задача, то она не может быть перемещена.
   * - Если при перемещении задачи ее позиция на доске не меняется (та же колонка та же позиция), то она не может быть перемещена.
   * - Задача не может быть перемещена на другую доску.
   * @param boardId - id текущей доски.
   * @param fromColumnId - id текущей колонки.
   * @param issueId - id текущей задачи.
   * @param body - параметры перемещения (previousId / nextId), toColumnId (опциональный) - целевая колонка.
   * @returns стандартный успешный ответ.
   * **/
  public async moveIssue(
    boardId: number,
    fromColumnId: number,
    issueId: number,
    body: TMoveIssue,
  ): Promise<TSuccessResponse> {
    if (!boardId || !fromColumnId || !issueId)
      throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { toColumnId, nextId, previousId } = body;
    const { manager } = this.dataSource;

    return await manager.transaction(async transactionalManager => {
      const targetIssue = await transactionalManager.findOne(IssueEntity, {
        where: { id: issueId, columnId: fromColumnId },
      });
      if (!targetIssue) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

      const isCurrentBoard = Boolean(targetIssue.boardId === boardId);
      const isCurrentColumn = Boolean(!toColumnId || toColumnId === targetIssue.columnId);
      const actualColumnId = toColumnId || targetIssue.columnId;

      if (!isCurrentBoard) throw new BadRequestException(EXCEPTION_MESSAGES.moveFailed);

      const targetColumn = await transactionalManager.findOne(ColumnEntity, {
        relations: { issues: true },
        where: { id: actualColumnId, boardId },
        order: { issues: { order: 'ASC' } },
      });
      if (!targetColumn) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

      const moveParameters: TMoveParameters = { nextId, previousId };
      const moveOptions: TMoveOptions = { allowForceMove: !isCurrentColumn };

      const issuesWithTarget = isCurrentColumn
        ? targetColumn.issues
        : [...targetColumn.issues, targetIssue];

      if (!isCurrentColumn && toColumnId) targetIssue.columnId = toColumnId;

      this.moveService.tryToMove(issuesWithTarget, issueId, moveParameters, moveOptions);
      await transactionalManager.save(IssueEntity, issuesWithTarget);

      return getSuccessResponse();
    });
  }

  /**
   * Частично обновить задачу.
   * @param issueId - id задачи.
   * @param body - поля для обновления.
   * @returns стандартный успешный ответ.
   * **/
  public async patchIssue(issueId: number, body: TPatchIssue): Promise<TSuccessResponse> {
    if (!issueId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const issue = await manager.findOne(IssueEntity, { where: { id: issueId } });
    if (!issue) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    await manager.save(IssueEntity, Object.assign(issue, body));

    return getSuccessResponse();
  }

  /**
   * Удалить задачу.
   * @param issueId - id задачи.
   * @returns стандартный успешный ответ.
   * **/
  public async deleteIssue(issueId: number): Promise<TSuccessResponse> {
    if (!issueId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;
    const { affected } = await manager.delete(IssueEntity, { id: issueId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException(EXCEPTION_MESSAGES.deleteFailed);

    return getSuccessResponse();
  }
}
