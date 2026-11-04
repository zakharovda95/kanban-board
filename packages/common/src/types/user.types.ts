import { EUserRole, EUserWorkspaceRole, EUserWorkspaceStatus } from '../enums/user.enums.js';
import { TSuccessResponse } from './response.types';

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
  userWorkspace: TUserWorkspace;
};

/** Данные о рабочем пространстве пользователя. **/
export type TUserWorkspace = {
  id: number;
  createdAt: Date;
  /** Через сколько будет удален. **/
  expiresAt: Date;
  status: EUserWorkspaceStatus;
  workspaceId: number;
  /** Роль пользователя в рабочем пространстве (один OWNER, остальные USER) **/
  workspaceRole: EUserWorkspaceRole;
};

/** Данные, необходимые для создания пользователя. **/
export type TCreateUser = Pick<TUser, 'firstName' | 'lastName'> &
  Pick<TUserWorkspace, 'workspaceId' | 'workspaceRole'> & {
    login: string;
    passwordHash: string;
  };

/** Ответ после обновления пользователя. Рабочее пространство при этом не меняется. **/
export type TUpdateUserResponse = TSuccessResponse<TUserBase>;
