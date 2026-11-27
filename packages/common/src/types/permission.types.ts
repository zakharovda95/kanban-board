import type {
  EBoardAccessPermissionField,
  EBoardPermissionField,
  EPermissionType,
  EProfilePermissionField,
} from '../enums/permission.enums.js';
import type { TBoardBase } from './board.types.js';

/** Поле конкретного типа разрешения. **/
export type TPermissionField =
  EProfilePermissionField | EBoardPermissionField | EBoardAccessPermissionField;

/** Форма разрешений конкретного типа. **/
export type TPermissionForm<T extends TPermissionField> = Record<T, boolean>;

/** Форма разрешений для конкретной доски. **/
export type TBoardAccessPermission = Pick<TBoardBase, 'id' | 'title'> & {
  permissions: TPermissionForm<EBoardAccessPermissionField>;
};

/** Полная форма разрешений. У OWNER отсутствует - ему доступно все. **/
export type TPermissions = {
  [EPermissionType.PROFILE]: TPermissionForm<EProfilePermissionField>;
  [EPermissionType.BOARD]: TPermissionForm<EBoardPermissionField>;
  [EPermissionType.BOARD_ACCESSES]: TBoardAccessPermission[];
};
