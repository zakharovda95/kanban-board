import type { TUser, TWorkspace, TWorkspaceBase } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import UserMapper from '@/modules/user/libs/mappers/user.mapper';
import UserWorkspaceMapper from '@/modules/user/libs/mappers/user-workspace.mapper';
import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';

@Injectable()
export default class WorkspaceMapper {
  constructor(
    private userMapper: UserMapper,
    private userWorkspaceMapper: UserWorkspaceMapper,
  ) {}

  public toModel(entity: WorkspaceEntity, options: { base: true }): TWorkspaceBase;
  public toModel(entity: WorkspaceEntity, options?: { base?: false }): TWorkspace;
  public toModel(entity: WorkspaceEntity[], options: { base: true }): TWorkspaceBase[];
  public toModel(entity: WorkspaceEntity[], options?: { base?: false }): TWorkspace[];

  public toModel(
    entity: WorkspaceEntity | WorkspaceEntity[],
    options?: { base?: boolean },
  ): TWorkspaceBase | TWorkspace | TWorkspaceBase[] | TWorkspace[] {
    const map = (innerEntity: WorkspaceEntity): TWorkspaceBase | TWorkspace => {
      const mapped: TWorkspaceBase = {
        id: innerEntity.id,
        createdAt: innerEntity.createdAt,
        expiresAt: innerEntity.expiresAt,
      };

      if (options?.base || innerEntity.userWorkspaces == null) return mapped;

      const users: TUser[] = innerEntity.userWorkspaces.map(userWorkspace => ({
        ...this.userMapper.toModel(userWorkspace.user, { base: true }),
        userWorkspace: this.userWorkspaceMapper.toModel(userWorkspace),
      }));

      return { ...mapped, users };
    };

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
