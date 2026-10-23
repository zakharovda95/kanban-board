import type { TUserWorkspace } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import UserWorkspaceEntity from '@/modules/user/libs/entities/user-workspace.entity';

@Injectable()
export default class UserWorkspaceMapper {
  public toModel(entity: UserWorkspaceEntity): TUserWorkspace;
  public toModel(entity: UserWorkspaceEntity[]): TUserWorkspace[];

  public toModel(
    entity: UserWorkspaceEntity | UserWorkspaceEntity[],
  ): TUserWorkspace | TUserWorkspace[] {
    const map = (innerEntity: UserWorkspaceEntity): TUserWorkspace => ({
      id: innerEntity.id,
      createdAt: innerEntity.createdAt,
      expiresAt: innerEntity.createdAt,
      workspaceId: innerEntity.workspaceId,
      workspaceRole: innerEntity.workspaceRole,
    });

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
