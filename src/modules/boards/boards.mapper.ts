import { Injectable } from '@nestjs/common';

import { BoardEntity } from '@/modules/boards/libs/entities/board.entity';
import type { TBoard, TBoardBase } from '@/modules/boards/libs/types/boards.types';
import { ColumnsMapper } from '@/modules/columns/columns.mapper';

@Injectable()
export class BoardsMapper {
  constructor(private columnsMapper: ColumnsMapper) {}

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

      return { ...mapped, columns: this.columnsMapper.toModel(columns) };
    };

    return Array.isArray(entity) ? entity.map(innerEntity => map(innerEntity)) : map(entity);
  }
}
