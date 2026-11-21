import { EUserRole, EUserWorkspaceRole, EUserWorkspaceStatus } from '../enums/user.enums.js';
import type { TBoardAccess, TBoardPermission, TProfilePermission } from './permission.types.js';
import type { TSuccessResponse } from './response.types.js';

/** Основные данные пользователя. **/
export type TUserBase = {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: Date;
  /** Системная роль пользователя (по сути все, кроме меня USER) **/
  systemRole: EUserRole;
  avatar: string | null;
  login: string;
};

export type TUser = TUserBase & {
  /** Статус пользователя в рабочем пространстве. **/
  status: EUserWorkspaceStatus;
  workspaceId: number;
  /** Роль пользователя в рабочем пространстве (один OWNER, остальные USER) **/
  workspaceRole: EUserWorkspaceRole;
  /** Список разрешений пользователя. У OWNER отсутствует - ему доступно все. **/
  permissions?: TUserPermissions;
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

/** Тип набора разрешений конкретного пользователя. **/
export type TUserPermissions = {
  profile: TProfilePermission[];
  board: TBoardPermission[];
  boardsAccesses: TBoardAccess[];
};
