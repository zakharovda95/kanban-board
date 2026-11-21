import type { TProfilePermission } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import ProfilePermissionEntity from '@/modules/permission/libs/entities/profile-permission.entity';

@Injectable()
export default class ProfilePermissionMapper {
  public toModel(entity: ProfilePermissionEntity): TProfilePermission;
  public toModel(entity: ProfilePermissionEntity[]): TProfilePermission[];

  public toModel(
    entity: ProfilePermissionEntity | ProfilePermissionEntity[],
  ): TProfilePermission | TProfilePermission[] {
    const map = (innerEntity: ProfilePermissionEntity): TProfilePermission => ({
      id: innerEntity.id,
      type: innerEntity.type,
    });

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
