import type { TUser, TUserBase } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import UserEntity from '@/modules/user/libs/entities/user.entity';
import UserWorkspaceMapper from '@/modules/user/libs/mappers/user-workspace.mapper';

@Injectable()
export default class UserMapper {
  constructor(private userWorkspaceMapper: UserWorkspaceMapper) {}

  public toModel(entity: UserEntity, options: { base: true }): TUserBase;
  public toModel(entity: UserEntity[], options: { base: true }): TUserBase[];
  public toModel(entity: UserEntity, options?: { base?: false }): TUser;
  public toModel(entity: UserEntity[], options?: { base?: false }): TUser[];

  public toModel(
    entity: UserEntity | UserEntity[],
    options?: { base?: boolean },
  ): TUserBase | TUserBase[] | TUser | TUser[] {
    const map = (innerEntity: UserEntity): TUser | TUserBase => {
      const mapped: TUserBase = {
        id: innerEntity.id,
        firstName: innerEntity.firstName,
        lastName: innerEntity.lastName,
        createdAt: innerEntity.createdAt,
        systemRole: innerEntity.systemRole,
        avatar: innerEntity.avatar,
        login: innerEntity.login,
      };

      if (options?.base) return mapped;
      return {
        ...mapped,
        userWorkspace: this.userWorkspaceMapper.toModel(innerEntity.userWorkspace),
      };
    };

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
