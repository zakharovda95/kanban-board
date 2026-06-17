import { Injectable } from '@nestjs/common';

import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import type { TColumn } from '@/modules/column/libs/types/column.types';
import { IssueMapper } from '@/modules/issue/issue.mapper';

@Injectable()
export class ColumnMapper {
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
      issues: this.issueMapper.toModel(innerEntity.issues),
    });

    return Array.isArray(entity) ? entity.map(innerEntity => map(innerEntity)) : map(entity);
  }
}
