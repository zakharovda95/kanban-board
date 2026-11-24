import type { TPermissionFields, TPermissionType } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class PermissionMapper {
  /**
   * Собрать группу полей формы разрешений.
   * @param types - все типы разрешений группы.
   * @param entities - выданные пользователю разрешения по группе.
   * @returns группа полей, где true у выданных разрешений.
   * **/
  public toFields<T extends TPermissionType>(
    types: T[],
    entities: { type: T }[],
  ): TPermissionFields<T> {
    const grantedTypes = new Set(entities.map(entity => entity.type));

    // мержим стандартную форму разрешений по типу с имеющимися записями для установки значения в true
    return Object.fromEntries(
      types.map(type => [type, grantedTypes.has(type)]),
    ) as TPermissionFields<T>;
  }
}
