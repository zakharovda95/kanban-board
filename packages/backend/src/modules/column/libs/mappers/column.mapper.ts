import type { TColumn } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import ColumnEntity from '@/modules/column/libs/entities/column.entity';
import IssueMapper from '@/modules/issue/libs/mappers/issue.mapper';

@Injectable()
export default class ColumnMapper {
  constructor(private issueMapper: IssueMapper) {}

  public toModel(entity: ColumnEntity): TColumn;
  public toModel(entity: ColumnEntity[]): TColumn[];
  public toModel(entity: ColumnEntity | ColumnEntity[]): TColumn | TColumn[] {
    const map = (innerEntity: ColumnEntity): TColumn => ({
      id: innerEntity.id,
      title: innerEntity.title,
      description: innerEntity.description,
      color: innerEntity.color,
      boardId: innerEntity.boardId,
      order: innerEntity.order,
      issues: this.issueMapper.toModel(innerEntity.issues, { base: true }),
    });

    return Array.isArray(entity) ? entity.map(innerEntity => map(innerEntity)) : map(entity);
  }
}
