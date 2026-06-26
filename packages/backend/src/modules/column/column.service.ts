import {
  ColorUtility,
  type TCreateColumn,
  type TCreateColumnResponse,
  type TMoveParameters,
  type TPatchColumn,
  type TSuccessResponse,
} from '@kanban-board/common';
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
import { BoardEntity } from '@/modules/board/libs/entities/board.entity';
import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import { MoveService } from '@/modules/shared/move/move.service';

@Injectable()
export class ColumnService {
  constructor(
    private dataSource: DataSource,
    private moveService: MoveService<ColumnEntity>,
  ) {}

  /**
   * Создать колонку на доске.
   * @param boardId - id доски.
   * @param body - данные колонки (title, color, description).
   * @returns стандартный успешный ответ с id созданной колонки.
   * **/
  public async createColumn(boardId: number, body: TCreateColumn): Promise<TCreateColumnResponse> {
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const isExists = await manager.exists(BoardEntity, { where: { id: boardId } });
    if (!isExists) throw new BadRequestException(EXCEPTION_MESSAGES.createFailed);

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
   * @returns стандартный успешный ответ.
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

  /**
   * Частично обновить колонку.
   * @param columnId - id колонки.
   * @param body - поля для обновления.
   * @returns стандартный успешный ответ.
   * **/
  public async patchColumn(columnId: number, body: TPatchColumn): Promise<TSuccessResponse> {
    if (!columnId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const column = await manager.findOne(ColumnEntity, { where: { id: columnId } });
    if (!column) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    await manager.save(Object.assign(column, body));

    return getSuccessResponse();
  }

  /**
   * Удалить колонку.
   * @param columnId - id колонки.
   * @returns стандартный успешный ответ.
   * **/
  public async deleteColumn(columnId: number): Promise<TSuccessResponse> {
    if (!columnId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;

    const { affected } = await manager.delete(ColumnEntity, { id: columnId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException(EXCEPTION_MESSAGES.deleteFailed);

    return getSuccessResponse();
  }
}
