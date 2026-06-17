import { Injectable } from '@nestjs/common';

import { IssueEntity } from '@/modules/issue/libs/entities/issue.entity';
import type { TIssue } from '@/modules/issue/libs/types/issue.types';

@Injectable()
export class IssueMapper {
  public toModel(entity: IssueEntity): TIssue;
  public toModel(entity: IssueEntity[]): TIssue[];
  public toModel(entity: IssueEntity | IssueEntity[]): TIssue | TIssue[] {
    const map = (innerEntity: IssueEntity): TIssue => ({
      id: innerEntity.id,
      createdAt: innerEntity.createdAt,
      updatedAt: innerEntity.updatedAt,
      title: innerEntity.title,
      description: innerEntity.description,
      columnId: innerEntity.columnId,
      order: innerEntity.order,
    });

    return Array.isArray(entity) ? entity.map(innerEntity => map(innerEntity)) : map(entity);
  }
}
