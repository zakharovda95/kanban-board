import type { TBoardAccessPermission } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import BoardAccessPermissionEntity from '@/modules/permission/libs/entities/board-access-permission.entity';

@Injectable()
export default class BoardAccessPermissionMapper {
  public toModel(entity: BoardAccessPermissionEntity): TBoardAccessPermission;
  public toModel(entity: BoardAccessPermissionEntity[]): TBoardAccessPermission[];

  public toModel(
    entity: BoardAccessPermissionEntity | BoardAccessPermissionEntity[],
  ): TBoardAccessPermission | TBoardAccessPermission[] {
    const map = (innerEntity: BoardAccessPermissionEntity): TBoardAccessPermission => ({
      id: innerEntity.id,
      type: innerEntity.type,
    });

    return Array.isArray(entity) ? entity.map(el => map(el)) : map(entity);
  }
}
