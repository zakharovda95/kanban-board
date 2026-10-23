import type { TUser } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import UserEntity from '@/modules/user/libs/entities/user.entity';

@Injectable()
export default class UserMapper {
  public toModel(entity: UserEntity): TUser;
  public toModel(entity: UserEntity[]): TUser[];

  public toModel(entity: UserEntity | UserEntity[]): TUser | TUser[] {
    const map = (innerEntity: UserEntity): TUser => ({
      id: innerEntity.id,
      firstName: innerEntity.firstName,
      lastName: innerEntity.lastName,
      createdAt: innerEntity.createdAt,
      status: innerEntity.status,
      systemRole: innerEntity.systemRole,
      avatar: innerEntity.avatar,
    });

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
