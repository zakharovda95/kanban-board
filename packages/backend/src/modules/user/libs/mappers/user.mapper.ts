import { EUserWorkspaceRole, type TUser, type TUserBase } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import PermissionMapper from '@/modules/permission/libs/mappers/permission.mapper';
import UserEntity from '@/modules/user/libs/entities/user.entity';

@Injectable()
export default class UserMapper {
  constructor(private permissionMapper: PermissionMapper) {}

  public toModel(entity: UserEntity, options: { base: true }): TUserBase;
  public toModel(entity: UserEntity[], options: { base: true }): TUserBase[];
  /** Требует загруженных profilePermissions, boardPermissions и workspace.boards.permissions. **/
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

      const user: TUser = {
        ...mapped,
        status: innerEntity.status,
        workspaceId: innerEntity.workspaceId,
        workspaceRole: innerEntity.workspaceRole,
      };

      // для OWNER нет разрешений тк у него полный доступ по его роли.
      if (innerEntity.workspaceRole === EUserWorkspaceRole.OWNER) return user;

      return {
        ...user,
        permissions: {
          profile: this.permissionMapper.toModel(innerEntity.profilePermissions),
          board: this.permissionMapper.toModel(innerEntity.boardPermissions),
          boardsAccesses: innerEntity.workspace.boards.map(board => ({
            id: board.id,
            title: board.title,
            permissions: this.permissionMapper.toModel(board.permissions),
          })),
        },
      };
    };

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
