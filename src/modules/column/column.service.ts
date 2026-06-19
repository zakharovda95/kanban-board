import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import type { TSuccessResponse } from '@/libs/types/response.types';
import { ColorUtility } from '@/libs/utilities/color.utility';
import { OrderUtility } from '@/libs/utilities/order.utility';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import type {
  TCreateColumn,
  TCreateColumnResponse,
  TPatchColumn,
} from '@/modules/column/libs/types/column.types';
import type { TMoveParameters } from '@/modules/shared/move/libs/types/move.types';
import { MoveService } from '@/modules/shared/move/move.service';

@Injectable()
export class ColumnService {
  constructor(
    private dataSource: DataSource,
    private moveService: MoveService<ColumnEntity>,
  ) {}

  public async createColumn(boardId: number, body: TCreateColumn): Promise<TCreateColumnResponse> {
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const columnsCount = await manager.count(ColumnEntity, { where: { boardId } });

    const { id } = await manager.save(ColumnEntity, {
      title: body.title,
      description: body?.description ?? null,
      color: body.color || ColorUtility.getRandomHexColor(),
      order: OrderUtility.calculateOrderByIndex(columnsCount),
      boardId: boardId,
    });
    if (!id) throw new InternalServerErrorException(EXCEPTION_MESSAGES.createFailed);

    return getSuccessResponseWithData({ id });
  }

  /**
   * Изменить порядок колонок на доске.
   * Правила перемещения:
   * - Должен быть указан только previousId или nextId, но не оба сразу.
   * - Если previousId - null - колонка помещается в начало.
   * - Если nextId - null - колонка помещается в конец.
   * - Если существует только одна колонка, то она не может быть перемещена.
   * - Если при перемещении колонки ее позиция на доске не меняется, то она не может быть перемещена.
   * - Колонка не может быть перемещена на другую доску.
   * @param boardId - id текущей доски.
   * @param columnId - id перемещаемой колонки.
   * @param body - параметры перемещения (previousId / nextId).
   * @returns - Стандартный успешный ответ.
   * **/
  public async moveColumn(
    boardId: number,
    columnId: number,
    body: TMoveParameters,
  ): Promise<TSuccessResponse> {
    if (!boardId || !columnId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;
    return manager.transaction(async transactionalManager => {
      const columns = await transactionalManager.find(ColumnEntity, {
        where: { boardId },
        order: { order: 'ASC' },
      });

      this.moveService.tryToMove(columns, columnId, body);
      await transactionalManager.save(ColumnEntity, columns);

      return getSuccessResponse();
    });
  }

  public async patchColumn(columnId: number, body: TPatchColumn): Promise<TSuccessResponse> {
    if (!columnId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const column = await manager.findOne(ColumnEntity, { where: { id: columnId } });
    if (!column) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    await manager.save(Object.assign(column, body));

    return getSuccessResponse();
  }

  public async deleteColumn(columnId: number): Promise<TSuccessResponse> {
    if (!columnId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;

    const { affected } = await manager.delete(ColumnEntity, { id: columnId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException(EXCEPTION_MESSAGES.deleteFailed);

    return getSuccessResponse();
  }
}
