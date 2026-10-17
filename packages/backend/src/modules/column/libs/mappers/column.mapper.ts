import type { TColumn, TColumnBase } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import ColumnEntity from '@/modules/column/libs/entities/column.entity';
import IssueMapper from '@/modules/issue/libs/mappers/issue.mapper';

@Injectable()
export default class ColumnMapper {
  constructor(private issueMapper: IssueMapper) {}

  public toModel(entity: ColumnEntity, options: { base: true }): TColumnBase;
  public toModel(entity: ColumnEntity, options?: { base?: false }): TColumn;
  public toModel(entity: ColumnEntity[], options: { base: true }): TColumnBase[];
  public toModel(entity: ColumnEntity[], options?: { base?: false }): TColumn[];

  public toModel(
    entity: ColumnEntity | ColumnEntity[],
    options?: { base?: boolean },
  ): TColumnBase | TColumn | TColumnBase[] | TColumn[] {
    const map = (innerEntity: ColumnEntity): TColumnBase | TColumn => {
      const mapped: TColumnBase = {
        id: innerEntity.id,
        title: innerEntity.title,
        description: innerEntity.description,
        color: innerEntity.color,
        boardId: innerEntity.boardId,
        order: innerEntity.order,
      };

      if (options?.base) return mapped;

      return {
        ...mapped,
        issues: this.issueMapper.toModel(innerEntity.issues, { base: true }),
      };
    };

    return Array.isArray(entity) ? entity.map(innerEntity => map(innerEntity)) : map(entity);
  }
}
