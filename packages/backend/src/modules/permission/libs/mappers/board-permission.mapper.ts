import type { TBoardPermission } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import BoardPermissionEntity from '@/modules/permission/libs/entities/board-permission.entity';

@Injectable()
export default class BoardPermissionMapper {
  public toModel(entity: BoardPermissionEntity): TBoardPermission;
  public toModel(entity: BoardPermissionEntity[]): TBoardPermission[];

  public toModel(
    entity: BoardPermissionEntity | BoardPermissionEntity[],
  ): TBoardPermission | TBoardPermission[] {
    const map = (innerEntity: BoardPermissionEntity): TBoardPermission => ({
      id: innerEntity.id,
      type: innerEntity.type,
    });

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
