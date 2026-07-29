import type { TIssue, TIssueBase } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import { IssueEntity } from '@/modules/issue/libs/entities/issue.entity';

@Injectable()
export class IssueMapper {
  public toModel(entity: IssueEntity, options?: { base: true }): TIssueBase;
  public toModel(entity: IssueEntity, options?: { base?: false }): TIssue;
  public toModel(entity: IssueEntity[], options?: { base: true }): TIssueBase[];
  public toModel(entity: IssueEntity[], options: { base?: false }): TIssue[];

  public toModel(
    entity: IssueEntity | IssueEntity[],
    options?: { base?: boolean },
  ): TIssueBase | TIssueBase[] | TIssue | TIssue[] {
    const map = (innerEntity: IssueEntity): TIssue | TIssueBase => {
      const mapped: TIssueBase = {
        id: innerEntity.id,
        createdAt: innerEntity.createdAt,
        title: innerEntity.title,
        boardId: innerEntity.boardId,
        columnId: innerEntity.columnId,
        order: innerEntity.order,
      };

      if (options?.base) return mapped;

      return {
        ...mapped,
        title: innerEntity.title,
        description: innerEntity.description,
      };
    };

    return Array.isArray(entity) ? entity.map(innerEntity => map(innerEntity)) : map(entity);
  }
}
