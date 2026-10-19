import { EUserRole } from '../enums/user.enums.js';
import { EWorkspaceRole } from '../enums/workspace.enums.js';

/** Пользователь. **/
export type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: Date;
  /** Системная роль пользователя (по сути все, кроме меня USER) **/
  systemRole: EUserRole;
  login: string;
  passwordHash: string;
  workspaceId: number;
  /** Роль пользователя в рабочем пространстве (один OWNER, остальные USER) **/
  workspaceRole: EWorkspaceRole;
};
