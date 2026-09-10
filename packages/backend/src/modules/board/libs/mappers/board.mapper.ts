import type { TBoard, TBoardBase } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import BoardEntity from '@/modules/board/libs/entities/board.entity';
import ColumnMapper from '@/modules/column/libs/mappers/column.mapper';

@Injectable()
export default class BoardMapper {
  constructor(private columnMapper: ColumnMapper) {}

  public toModel(entity: BoardEntity, options: { base: true }): TBoardBase;
  public toModel(entity: BoardEntity, options?: { base?: false }): TBoard;
  public toModel(entity: BoardEntity[], options: { base: true }): TBoardBase[];
  public toModel(entity: BoardEntity[], options?: { base?: false }): TBoard[];

  public toModel(
    entity: BoardEntity | BoardEntity[],
    options?: { base?: boolean },
  ): TBoardBase | TBoard | TBoardBase[] | TBoard[] {
    const map = (innerEntity: BoardEntity): TBoardBase | TBoard => {
      const mapped: TBoardBase = {
        id: innerEntity.id,
        title: innerEntity.title,
        description: innerEntity.description,
        order: innerEntity.order,
      };

      if (options?.base || innerEntity.columns == null) return mapped;

      return { ...mapped, columns: this.columnMapper.toModel(innerEntity.columns) };
    };

    return Array.isArray(entity) ? entity.map(innerEntity => map(innerEntity)) : map(entity);
  }
}
