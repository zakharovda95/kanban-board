import {
  ColorUtility,
  type TColumn,
  type TCreateColumn,
  type TDeleteColumnEmitPayload,
  type TMoveParameters,
  type TSuccessResponse,
  type TUpdateColumn,
} from '@kanban-board/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { OrderUtility } from '@/libs/utilities/order.utility';
import { getSuccessResponse } from '@/libs/utilities/response.utilities';
import { BoardEntity } from '@/modules/board/libs/entities/board.entity';
import { ColumnMapper } from '@/modules/column/column.mapper';
import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import { MoveService } from '@/modules/shared/move/move.service';

@Injectable()
export class ColumnService {
  constructor(
    private dataSource: DataSource,
    private moveService: MoveService<ColumnEntity>,
    private columnMapper: ColumnMapper,
  ) {}

  /**
   * Создать колонку на доске.
   * @param body - данные колонки (boardId, title, color, description).
   * @returns объект созданной колонки.
   * **/
  public async createColumn(body: TCreateColumn): Promise<TColumn> {
    if (!body) throw new WsException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { boardId, color, title, description } = body;
    const { manager } = this.dataSource;

    const isExists = await manager.exists(BoardEntity, { where: { id: boardId } });
    if (!isExists) throw new WsException(EXCEPTION_MESSAGES.createFailed);

    const columnsCount = await manager.count(ColumnEntity, { where: { boardId } });

    const createdColumn = await manager.save(ColumnEntity, {
      title,
      description: description ?? null,
      color: color || ColorUtility.getRandomHexColor(),
      order: OrderUtility.calculateOrderByIndex(columnsCount),
      boardId,
    });
    if (!createdColumn) throw new WsException(EXCEPTION_MESSAGES.createFailed);

    return this.columnMapper.toModel(createdColumn);
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
   * @param body - поля для обновления (id, title, color, description).
   * @returns объект обновленной колонки.
   * **/
  public async updateColumn(body: TUpdateColumn): Promise<TColumn> {
    if (!body) throw new WsException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { id, ...rest } = body;
    const { manager } = this.dataSource;

    const column = await manager.findOne(ColumnEntity, { where: { id } });
    if (!column) throw new WsException(EXCEPTION_MESSAGES.notFound);

    const updatedColumn = await manager.save(Object.assign(column, rest));
    if (!updatedColumn) throw new WsException(EXCEPTION_MESSAGES.updateFailed);
    return this.columnMapper.toModel(updatedColumn);
  }

  /**
   * Удалить колонку.
   * @param columnId - id колонки.
   * @returns массив колонок и ID удаленной доски.
   * **/
  public async deleteColumn(columnId: number): Promise<TDeleteColumnEmitPayload> {
    if (!columnId) throw new WsException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const target = await transactionalManager.findOne(ColumnEntity, { where: { id: columnId } });
      if (!target) throw new WsException(EXCEPTION_MESSAGES.notFound);

      const columns = await transactionalManager.find(ColumnEntity, {
        where: { boardId: target.boardId },
        order: { order: 'ASC' },
      });

      const { affected } = await transactionalManager.delete(ColumnEntity, { id: columnId });
      if (!affected || affected <= 0) throw new WsException(EXCEPTION_MESSAGES.deleteFailed);

      const withoutTarget = columns.filter(({ id }) => id !== columnId);
      this.moveService.resetOrders(withoutTarget);

      const columnsAfterDeleting = await transactionalManager.save(ColumnEntity, withoutTarget);

      return {
        deletedColumnId: columnId,
        columns: this.columnMapper.toModel(columnsAfterDeleting),
      };
    });
  }
}
