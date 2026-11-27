import type { TPermissionField, TPermissionForm } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class PermissionMapper {
  /**
   * Собрать группу полей формы разрешений.
   * @param fields - все поля разрешений группы.
   * @param entities - выданные пользователю разрешения по группе.
   * @returns группа полей, где true у выданных разрешений.
   * **/
  public toFields<T extends TPermissionField>(
    fields: T[],
    entities: { field: T }[],
  ): TPermissionForm<T> {
    const grantedFields = new Set(entities.map(entity => entity.field));

    // мержим стандартную форму разрешений по типу с имеющимися записями для установки значения в true
    return Object.fromEntries(
      fields.map(field => [field, grantedFields.has(field)]),
    ) as TPermissionForm<T>;
  }
}
