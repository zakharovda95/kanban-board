import { EUserRole, EUserStatus } from '../enums/user.enums.js';
import { EWorkspaceRole } from '../enums/workspace.enums.js';

/** Основные данные пользователя. **/
export type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: Date;
  status: EUserStatus;
  /** Системная роль пользователя (по сути все, кроме меня USER) **/
  systemRole: EUserRole;
  avatar: string | null;
};

/** Данные о рабочем пространстве пользователя. **/
export type TUserWorkspace = {
  id: number;
  createdAt: Date;
  /** Через сколько будет удален. **/
  expiresAt: Date;
  workspaceId: number;
  /** Роль пользователя в рабочем пространстве (один OWNER, остальные USER) **/
  workspaceRole: EWorkspaceRole;
};

/** Данные, необходимые для создания пользователя. **/
export type TCreateUser = Pick<TUser, 'firstName' | 'lastName'> &
  Pick<TUserWorkspace, 'workspaceId'> & {
    login: string;
    passwordHash: string;
  };
