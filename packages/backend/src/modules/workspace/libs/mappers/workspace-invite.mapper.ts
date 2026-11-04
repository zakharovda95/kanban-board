import type { TWorkspaceInvite } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import WorkspaceInviteEntity from '@/modules/workspace/libs/entities/workspace-invite.entity';

@Injectable()
export default class WorkspaceInviteMapper {
  public toModel(entity: WorkspaceInviteEntity): TWorkspaceInvite;
  public toModel(entity: WorkspaceInviteEntity[]): TWorkspaceInvite[];

  public toModel(
    entity: WorkspaceInviteEntity | WorkspaceInviteEntity[],
  ): TWorkspaceInvite | TWorkspaceInvite[] {
    const map = (innerEntity: WorkspaceInviteEntity): TWorkspaceInvite => ({
      id: innerEntity.id,
      createdAt: innerEntity.createdAt,
      expiresAt: innerEntity.expiresAt,
      inviteToken: innerEntity.inviteToken,
      workspaceId: innerEntity.workspaceId,
    });

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
