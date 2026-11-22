import {
  EBoardAccessUserPermissionType,
  EBoardUserPermissionType,
  EProfileUserPermissionType,
  EUserRole,
  EUserWorkspaceRole,
  EUserWorkspaceStatus,
} from '../enums/user.enums.js';
import type { TBoardBase } from './board.types.js';
import type { TSuccessResponse } from './response.types.js';

/** Основные данные пользователя. **/
export type TUserBase = {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string | null;
  login: string;
};

export type TUser = TUserBase & {
  createdAt: Date;
  /** Системная роль пользователя (по сути все, кроме меня USER) **/
  systemRole: EUserRole;
  /** Статус пользователя в рабочем пространстве. **/
  status: EUserWorkspaceStatus;
  workspaceId: number;
  /** Роль пользователя в рабочем пространстве (один OWNER, остальные USER) **/
  workspaceRole: EUserWorkspaceRole;
};

/** Данные, необходимые для создания пользователя. **/
export type TCreateUser = Pick<
  TUser,
  'firstName' | 'lastName' | 'workspaceId' | 'workspaceRole'
> & {
  login: string;
  passwordHash: string;
};

/** Ответ после обновления пользователя. Рабочее пространство при этом не меняется. **/
export type TUpdateUserResponse = TSuccessResponse<TUserBase>;

/** Любой тип пользовательского разрешения. **/
export type TUserPermissionType =
  EProfileUserPermissionType | EBoardUserPermissionType | EBoardAccessUserPermissionType;

/** Группа полей формы разрешений: по ключу - тип разрешения, если значение true - разрешение включено. **/
export type TUserPermissionFields<T extends TUserPermissionType> = Record<T, boolean>;

/** Форма разрешений для конкретной доски. **/
export type TUserBoardAccess = Pick<TBoardBase, 'id' | 'title'> & {
  permissions: TUserPermissionFields<EBoardAccessUserPermissionType>;
};

/** Форма разрешений конкретного пользователя. У OWNER отсутствует - ему доступно все. **/
export type TUserPermissions = {
  profile: TUserPermissionFields<EProfileUserPermissionType>;
  board: TUserPermissionFields<EBoardUserPermissionType>;
  boardsAccesses: TUserBoardAccess[];
};
