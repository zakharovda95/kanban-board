import { Injectable } from '@nestjs/common';

import type { TMapper } from '@/libs/types/mapper.types';
import { ColumnEntity } from '@/modules/columns/libs/entities/column.entity';
import type { TColumn } from '@/modules/columns/libs/types/columns.types';
import { IssuesMapper } from '@/modules/issues/issues.mapper';

@Injectable()
export class ColumnsMapper implements TMapper<ColumnEntity, TColumn> {
  constructor(private issuesMapper: IssuesMapper) {}

  public toModel(entity: ColumnEntity): TColumn;
  public toModel(entity: ColumnEntity[]): TColumn[];
  public toModel(entity: ColumnEntity | ColumnEntity[]): TColumn | TColumn[] {
    const map = ({
      columnId,
      title,
      description,
      color,
      boardId,
      order,
      issues,
    }: ColumnEntity): TColumn => ({
      columnId,
      title,
      description,
      color,
      boardId,
      order,
      issues: this.issuesMapper.toModel(issues),
    });

    return Array.isArray(entity) ? entity.map(innerEntity => map(innerEntity)) : map(entity);
  }
}
