import type {
  EBoardAccessPermissionType,
  EBoardPermissionType,
  EProfilePermissionType,
} from '../enums/permission.enums.js';
import type { TBoardBase } from './board.types.js';

/** Любой тип разрешения. **/
export type TPermissionType =
  EProfilePermissionType | EBoardPermissionType | EBoardAccessPermissionType;

/** Форма разрешений конкретного типа. **/
export type TPermissionFields<T extends TPermissionType> = Record<T, boolean>;

/** Форма разрешений для конкретной доски. **/
export type TBoardAccess = Pick<TBoardBase, 'id' | 'title'> & {
  permissions: TPermissionFields<EBoardAccessPermissionType>;
};

/** Полная форма разрешений. У OWNER отсутствует - ему доступно все. **/
export type TPermissions = {
  profile: TPermissionFields<EProfilePermissionType>;
  board: TPermissionFields<EBoardPermissionType>;
  boardsAccesses: TBoardAccess[];
};
