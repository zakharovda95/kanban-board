import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import type { TSuccessResponse } from '@/libs/types/response.types';
import { OrderUtility } from '@/libs/utilities/order.utility';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
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

  public async getIssueById(issueId: number): Promise<TIssue> {
    const { manager } = this.dataSource;
    const issue = await manager.findOne(IssueEntity, { where: { id: issueId } });
    if (!issue) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    return this.issueMapper.toModel(issue);
  }

  public async createIssue(columnId: number, body: TCreateIssue): Promise<TCreateIssueResponse> {
    if (!columnId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const issuesCount = await manager.count(IssueEntity, { where: { columnId } });

    const { id } = await manager.save(IssueEntity, {
      title: body.title,
      description: body?.description ?? null,
      order: OrderUtility.calculateOrderByIndex(issuesCount),
      columnId: columnId,
    });
    if (!id) throw new InternalServerErrorException(EXCEPTION_MESSAGES.createFailed);

    return getSuccessResponseWithData({ id });
  }

  /**
   * Переместить задачу.
   * Правила перемещения:
   * - Если указан columnId - задача перемещается в указанную колонку.
   * - Если не указан columnId - перемещение в рамках текущей колонки.
   * - Должен быть указаны только previousId или nextId, но не оба сразу.
   * - Если previousId - null - задача помещается в начало.
   * - Если nextId - null - задача помещается в конец.
   * - При перемещении задачи в другую ПУСТУЮ колонку необходимо указать previousId или nextId в значении null (иначе ошибка).
   * - Если существует только одна задача, то она не может быть перемещена.
   * - Если при перемещении задачи ее позиция на доске не меняется (та же колонка та же позиция), то она не может быть перемещена.
   * - Задача не может быть перемещена на другую доску.
   * @param issueId - id текущей задачи.
   * @param body - параметры перемещения (previousId / nextId), columnId (опциональный) - целевая колонка.
   * @returns - Стандартный успешный ответ.
   * **/
  public async moveIssue(issueId: number, body: TMoveIssue): Promise<TSuccessResponse> {
    if (!issueId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { columnId, nextId, previousId } = body;
    const { manager } = this.dataSource;

    return await manager.transaction(async transactionalManager => {
      const targetIssue = await transactionalManager.findOne(IssueEntity, {
        where: { id: issueId },
      });
      if (!targetIssue) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

      const issues = await transactionalManager.find(IssueEntity, {
        where: { columnId: columnId ?? targetIssue.columnId },
        order: { order: 'ASC' },
      });

      const moveParameters: TMoveParameters = { nextId, previousId };
      const moveOptions: TMoveOptions = {
        allowForceMove: Boolean(columnId && columnId !== targetIssue.columnId),
      };

      const issuesWithTarget =
        !columnId || targetIssue.columnId === columnId ? issues : [...issues, targetIssue];

      if (columnId) targetIssue.columnId = columnId;

      this.moveService.tryToMove(issuesWithTarget, issueId, moveParameters, moveOptions);
      await transactionalManager.save(IssueEntity, issuesWithTarget);

      return getSuccessResponse();
    });
  }

  public async patchIssue(issueId: number, body: TPatchIssue): Promise<TSuccessResponse> {
    if (!issueId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const issue = await manager.findOne(IssueEntity, { where: { id: issueId } });
    if (!issue) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    await manager.save(IssueEntity, Object.assign(issue, body));

    return getSuccessResponse();
  }

  public async deleteIssue(issueId: number): Promise<TSuccessResponse> {
    if (!issueId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;
    const { affected } = await manager.delete(IssueEntity, { id: issueId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException(EXCEPTION_MESSAGES.deleteFailed);

    return getSuccessResponse();
  }
}
