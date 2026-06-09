import { Injectable } from '@nestjs/common';

import type { TMapper } from '@/libs/types/mapper.types';
import { BoardEntity } from '@/modules/boards/libs/entities/board.entity';
import type { TBoard } from '@/modules/boards/libs/types/boards.types';
import { ColumnsMapper } from '@/modules/columns/columns.mapper';

@Injectable()
export class BoardsMapper implements TMapper<BoardEntity, TBoard> {
  constructor(private columnsMapper: ColumnsMapper) {}

  toModel(entity: BoardEntity): TBoard;
  toModel(entity: BoardEntity[]): TBoard[];
  toModel(entity: BoardEntity | BoardEntity[]): TBoard | TBoard[] {
    const map = ({ boardId, title, description, columns }: BoardEntity): TBoard => ({
      boardId,
      title,
      description,
      columns: this.columnsMapper.toModel(columns),
    });

    return Array.isArray(entity) ? entity.map(innerEntity => map(innerEntity)) : map(entity);
  }
}
