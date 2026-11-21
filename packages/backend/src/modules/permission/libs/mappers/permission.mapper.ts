import type { TPermissionBase } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import BoardAccessPermissionEntity from '@/modules/permission/libs/entities/board-access-permission.entity';
import BoardPermissionEntity from '@/modules/permission/libs/entities/board-permission.entity';
import ProfilePermissionEntity from '@/modules/permission/libs/entities/profile-permission.entity';

type TPermissionEntity =
  ProfilePermissionEntity | BoardPermissionEntity | BoardAccessPermissionEntity;

@Injectable()
export default class PermissionMapper {
  public toModel<E extends TPermissionEntity>(entity: E): TPermissionBase<E['type']>;
  public toModel<E extends TPermissionEntity>(entity: E[]): TPermissionBase<E['type']>[];

  public toModel<E extends TPermissionEntity>(
    entity: E | E[],
  ): TPermissionBase<E['type']> | TPermissionBase<E['type']>[] {
    const map = (innerEntity: E): TPermissionBase<E['type']> => ({
      id: innerEntity.id,
      type: innerEntity.type,
    });

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
