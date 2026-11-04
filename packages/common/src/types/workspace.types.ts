import { TSuccessResponse } from './response.types.js';
import type { TUser } from './user.types.js';

/** Рабочее пространство - базовые данные. **/
export type TWorkspaceBase = {
  id: number;
  createdAt: Date;
  expiresAt: Date;
};

/** Рабочее пространство - полные данные. **/
export type TWorkspace = TWorkspaceBase & {
  users: TUser[];
};

/** Данные приглашения в рабочее пространство. **/
export type TWorkspaceInvite = {
  id: number;
  createdAt: Date;
  expiresAt: Date;
  inviteToken: string;
  workspaceId: number;
};

/** Сгенерированный инвайт-токен. **/
export type TCreateWorkspaceInviteToken = Pick<TWorkspaceInvite, 'inviteToken' | 'expiresAt'>;

/** Ответ на запрос на генерацию инвайт-токена. **/
export type TCreateWorkspaceInviteTokenResponse = TSuccessResponse<TCreateWorkspaceInviteToken>;
