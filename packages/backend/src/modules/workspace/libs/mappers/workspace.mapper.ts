import { TWorkspace } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';

@Injectable()
export default class WorkspaceMapper {
  public toModel(entity: WorkspaceEntity): TWorkspace;
  public toModel(entity: WorkspaceEntity[]): TWorkspace[];

  public toModel(entity: WorkspaceEntity | WorkspaceEntity[]): TWorkspace | TWorkspace[] {
    const map = (innerEntity: WorkspaceEntity): TWorkspace => ({
      id: innerEntity.id,
      createdAt: innerEntity.createdAt,
      expiresAt: innerEntity.expiresAt,
    });

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
