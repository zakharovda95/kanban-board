import { type TWorkspaceBase } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';

@Injectable()
export default class WorkspaceMapper {
  public toModel(entity: WorkspaceEntity): TWorkspaceBase;
  public toModel(entity: WorkspaceEntity[]): TWorkspaceBase[];

  public toModel(entity: WorkspaceEntity | WorkspaceEntity[]): TWorkspaceBase | TWorkspaceBase[] {
    const map = (innerEntity: WorkspaceEntity): TWorkspaceBase => ({
      id: innerEntity.id,
      createdAt: innerEntity.createdAt,
    });

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
