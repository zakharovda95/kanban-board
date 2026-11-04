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

/** Данные приглашения в рабочее пространство. Сырого токена здесь нет: в базе хранится только хеш. **/
export type TWorkspaceInvite = {
  id: number;
  createdAt: Date;
  expiresAt: Date;
  workspaceId: number;
};

/** Сгенерированный инвайт-токен. Сырое значение показывается один раз и в базе не хранится. **/
export type TCreateWorkspaceInviteToken = Pick<TWorkspaceInvite, 'expiresAt'> & {
  inviteToken: string;
};

/** Ответ на запрос на генерацию инвайт-токена. **/
export type TCreateWorkspaceInviteTokenResponse = TSuccessResponse<TCreateWorkspaceInviteToken>;
