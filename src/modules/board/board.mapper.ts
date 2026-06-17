import { Injectable } from '@nestjs/common';

import { BoardEntity } from '@/modules/board/libs/entities/board.entity';
import type { TBoard, TBoardBase } from '@/modules/board/libs/types/board.types';
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
    const map = ({
      boardId,
      title,
      description,
      order,
      columns,
    }: BoardEntity): TBoardBase | TBoard => {
      const mapped: TBoardBase = {
        boardId,
        title,
        description,
        order,
      };
      if (!options?.withRelations || columns == null) return mapped;

      return { ...mapped, columns: this.columnMapper.toModel(columns) };
    };

    return Array.isArray(entity) ? entity.map(innerEntity => map(innerEntity)) : map(entity);
  }
}
