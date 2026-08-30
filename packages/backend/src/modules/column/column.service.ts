import {
  ColorUtility,
  type TColumn,
  type TCreateColumn,
  type TDeleteColumnEmitPayload,
  type TMoveColumn,
  type TMoveColumnEmitPayload,
  type TMoveParameters,
  type TUpdateColumn,
} from '@kanban-board/common';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import OrderUtility from '@/libs/utilities/order.utility';
import BoardEntity from '@/modules/board/libs/entities/board.entity';
import BoardMapper from '@/modules/board/libs/mappers/board.mapper';
import ColumnEntity from '@/modules/column/libs/entities/column.entity';
import ColumnMapper from '@/modules/column/libs/mappers/column.mapper';
import MoveService from '@/modules/shared/move/move.service';

@Injectable()
export default class ColumnService {
  constructor(
    private dataSource: DataSource,
    private moveService: MoveService<ColumnEntity>,
    private columnMapper: ColumnMapper,
    private boardMapper: BoardMapper,
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

    return this.columnMapper.toModel({ ...createdColumn, issues: [] });
  }

  /**
   * Изменить порядок колонок на доске.
   * Правила перемещения:
   * - Должен быть указан previousId - id колонки после которой будет перемещаемая колонка (может быть null).
   * - Если previousId - null - колонка помещается в начало.
   * - Если существует только одна колонка, то она не может быть перемещена.
   * - Если при перемещении колонки ее позиция на доске не меняется, то она не может быть перемещена.
   * - Колонка не может быть перемещена на другую доску.
   * @param body - параметры перемещения (previousId, targetId, boardId).
   * @returns id gtеремещенной колонки и обновленная доска.
   * **/
  public async moveColumn(body: TMoveColumn): Promise<TMoveColumnEmitPayload> {
    if (!body) throw new WsException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { boardId, targetId, previousId } = body;
    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const columns = await transactionalManager.find(ColumnEntity, {
        where: { boardId },
        order: { order: 'ASC' },
      });

      const moveParameters: TMoveParameters = { targetId, previousId };
      this.moveService.tryToMove(columns, moveParameters);
      await transactionalManager.save(ColumnEntity, columns);

      const boardAfterMove = await transactionalManager.findOne(BoardEntity, {
        where: { id: boardId },
        order: { order: 'ASC', columns: { order: 'ASC', issues: { order: 'ASC' } } },
        relations: { columns: { issues: true } },
      });
      if (!boardAfterMove) throw new WsException(EXCEPTION_MESSAGES.notFound);

      return {
        boardId,
        movedColumnId: targetId,
        board: this.boardMapper.toModel(boardAfterMove, { withRelations: true }),
      };
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

    await manager.save(Object.assign(column, rest));

    const columnAfterUpdating = await manager.findOne(ColumnEntity, {
      where: { id },
      relations: { issues: true },
    });
    if (!columnAfterUpdating) throw new WsException(EXCEPTION_MESSAGES.notFound);

    return this.columnMapper.toModel(columnAfterUpdating);
  }

  /**
   * Удалить колонку.
   * @param columnId - id колонки.
   * @returns массив колонок после reorder и ID удаленной доски.
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

      await transactionalManager.save(ColumnEntity, withoutTarget);

      const columnsAfterDeleting = await transactionalManager.find(ColumnEntity, {
        where: { boardId: target.boardId },
        order: { order: 'ASC' },
        relations: { issues: true },
      });

      return {
        boardId: target.boardId,
        deletedColumnId: target.id,
        columns: this.columnMapper.toModel(columnsAfterDeleting),
      };
    });
  }
}
