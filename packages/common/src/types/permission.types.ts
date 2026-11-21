import type {
  EBoardAccessPermissionType,
  EBoardPermissionType,
  EProfilePermissionType,
} from '../enums/permission.enums.js';
import type { TBoardBase } from './board.types.js';

/** Базовый тип разрешения. Наличие записи означает, что разрешение выдано. **/
export type TPermissionBase<T extends string> = {
  id: number;
  type: T;
};

/** Тип разрешения на определенное действие с собственным профилем. **/
export type TProfilePermission = TPermissionBase<EProfilePermissionType>;

/** Тип разрешения на определенное действие с доской (не над конкретной доской, а в целом). **/
export type TBoardPermission = TPermissionBase<EBoardPermissionType>;

/** Тип разрешения на определенное действие с конкретной доской. **/
export type TBoardAccessPermission = TPermissionBase<EBoardAccessPermissionType>;

/** Доска со списком разрешений пользователя на нее. **/
export type TBoardAccess = Pick<TBoardBase, 'id' | 'title'> & {
  permissions: TBoardAccessPermission[];
};
