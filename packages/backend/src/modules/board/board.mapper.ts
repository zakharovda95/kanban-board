import type { TBoard, TBoardBase } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import { BoardEntity } from '@/modules/board/libs/entities/board.entity';
import { ColumnMapper } from '@/modules/column/column.mapper';

@Injectable()
export class BoardMapper {
  constructor(private columnMapper: ColumnMapper) {}

  toModel(entity: BoardEntity, options: { withRelations?: false }): TBoardBase;
  toModel(entity: BoardEntity, options?: { withRelations: true }): TBoard;
  toModel(entity: BoardEntity[], options?: { withRelations?: false }): TBoardBase[];
  toModel(entity: BoardEntity[], options?: { withRelations: true }): TBoard[];

  toModel(
    entity: BoardEntity | BoardEntity[],
    options?: { withRelations: true } | { withRelations?: false },
  ): TBoardBase | TBoard | TBoardBase[] | TBoard[] {
    const map = (innerEntity: BoardEntity): TBoardBase | TBoard => {
      const mapped: TBoardBase = {
        id: innerEntity.id,
        title: innerEntity.title,
        description: innerEntity.description,
        order: innerEntity.order,
      };

      if (!options?.withRelations || innerEntity.columns == null) return mapped;

      return { ...mapped, columns: this.columnMapper.toModel(innerEntity.columns) };
    };

    return Array.isArray(entity) ? entity.map(innerEntity => map(innerEntity)) : map(entity);
  }
}
