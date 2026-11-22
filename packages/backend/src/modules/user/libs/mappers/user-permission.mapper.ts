import type { TUserPermissionFields, TUserPermissionType } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserPermissionMapper {
  /**
   * Собрать группу полей формы разрешений.
   * @param types - все типы разрешений группы.
   * @param entities - выданные пользователю разрешения группы.
   * @returns группа полей, где true у выданных разрешений.
   * **/
  public toFields<T extends TUserPermissionType>(
    types: T[],
    entities: { type: T }[],
  ): TUserPermissionFields<T> {
    const grantedTypes = new Set(entities.map(entity => entity.type));

    // мержим стандартную форму разрешений по типу с имеющимися записями для установки значения в true
    return Object.fromEntries(
      types.map(type => [type, grantedTypes.has(type)]),
    ) as TUserPermissionFields<T>;
  }
}
