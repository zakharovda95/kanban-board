import type {
  TColumn,
  TColumnBase,
  TCreateColumnBodySchema,
  TDeleteColumnEmitPayload,
  TMoveColumnBodySchema,
  TMoveColumnEmitPayload,
  TMoveParametersBodySchema,
  TPositiveIdSchema,
  TUpdateColumnBodySchema,
} from '@kanban-board/common';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DataSource } from 'typeorm';

import OrderUtility from '@/libs/utilities/order.utility';
import { TMaxOrderResult } from '@/libs/utilities/order.utility';
import BoardEntity from '@/modules/board/libs/entities/board.entity';
import ColumnEntity from '@/modules/column/libs/entities/column.entity';
import ColumnMapper from '@/modules/column/libs/mappers/column.mapper';
import MoveService from '@/modules/shared/move/move.service';

@Injectable()
export default class ColumnService {
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
  public async createColumn(body: TCreateColumnBodySchema): Promise<TColumn> {
    const { boardId, color, title, description } = body;
    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1001;
      // Блокируем доступ к базе данных для предотвращения одновременного создания нескольких колонок.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1, $2)', [
        DATABASE_LOCK_ID,
        boardId,
      ]);

      const isExists = await transactionalManager.exists(BoardEntity, { where: { id: boardId } });
      if (!isExists)
        throw new WsException('Не удалось создать колонку: указанная доска не найдена');

      // Получаем максимальный order колонки в целевой доске, чтобы при создании прибавить ORDER_STEP
      const result = await transactionalManager
        .createQueryBuilder()
        .select('MAX(column.order)', 'maxOrder')
        .from(ColumnEntity, 'column')
        .where('column.boardId = :boardId', { boardId })
        .getRawOne<TMaxOrderResult>();

      const newColumn = transactionalManager.create(ColumnEntity, {
        title,
        description: description ?? null,
        color,
        order: OrderUtility.calculateNextOrder(result?.maxOrder ?? 0),
        boardId,
      });

      const createdColumn = await transactionalManager.save(newColumn);

      return this.columnMapper.toModel({ ...createdColumn, issues: [] }, { base: false });
    });
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
   * @returns id перемещенной колонки и перемещенная колонка или null, если был reorder всех колонок и нужно сделать refetch.
   * **/
  public async moveColumn(body: TMoveColumnBodySchema): Promise<TMoveColumnEmitPayload> {
    const { boardId, targetId, previousId } = body;
    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const columns = await transactionalManager.find(ColumnEntity, {
        where: { boardId },
        order: { order: 'ASC' },
      });

      const moveParameters: TMoveParametersBodySchema = { targetId, previousId };
      const moveResult = this.moveService.tryToMove(columns, moveParameters);
      await transactionalManager.save(ColumnEntity, columns);

      let movedColumn: TColumnBase | null = null;

      if (!moveResult.isOrderWasNormalized) {
        const movedColumnEntity = await transactionalManager.findOne(ColumnEntity, {
          where: { id: targetId },
        });
        if (movedColumnEntity)
          movedColumn = this.columnMapper.toModel(movedColumnEntity, { base: true });
      }

      return {
        boardId,
        movedColumnId: targetId,
        movedColumn,
      };
    });
  }

  /**
   * Частично обновить колонку.
   * @param body - поля для обновления (id, title, color, description).
   * @returns базовый объект обновленной колонки (без задач).
   * **/
  public async updateColumn(body: TUpdateColumnBodySchema): Promise<TColumnBase> {
    const { id, ...rest } = body;
    const { manager } = this.dataSource;

    const column = await manager.findOne(ColumnEntity, { where: { id } });
    if (!column) throw new WsException('Колонка для обновления не найдена');

    const updatedColumn = await manager.save(Object.assign(column, rest));

    return this.columnMapper.toModel(updatedColumn, { base: true });
  }

  /**
   * Удалить колонку.
   * @param columnId - id колонки.
   * @returns ID доски и ID удаленной доски.
   * **/
  public async deleteColumn(columnId: TPositiveIdSchema): Promise<TDeleteColumnEmitPayload> {
    const { manager } = this.dataSource;

    const target = await manager.findOne(ColumnEntity, { where: { id: columnId } });
    if (!target) throw new WsException('Колонка для удаления не найдена');

    await manager.delete(ColumnEntity, { id: columnId });

    return {
      boardId: target.boardId,
      deletedColumnId: target.id,
    };
  }
}
