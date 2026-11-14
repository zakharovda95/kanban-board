import { TSuccessResponse } from './response.types.js';
import type { TUser } from './user.types.js';

/** Рабочее пространство - базовые данные. **/
export type TWorkspaceBase = {
  id: number;
  createdAt: Date;
};

/** Рабочее пространство - полные данные. **/
export type TWorkspace = TWorkspaceBase & {
  users: TWorkspaceUsers;
  invites: TWorkspaceInvites;
};

/** Данные приглашения в рабочее пространство. Сырого токена здесь нет: в базе хранится только хеш. **/
export type TWorkspaceInvite = {
  id: number;
  createdAt: Date;
  expiresAt: Date;
  name: string;
  workspaceId: number;
};

/** Счетчики рабочего пространства. **/
export type TWorkspaceCounters = {
  total: number;
  occupied: number;
  available: number;
};

/** Инвайты рабочего пространство со счетчиками. **/
export type TWorkspaceInvites = TWorkspaceCounters & {
  invites: TWorkspaceInvite[];
};

/** Пользователи рабочего пространство со счетчиками. **/
export type TWorkspaceUsers = TWorkspaceCounters & {
  users: TUser[];
};

/** Сгенерированный инвайт-токен. Сырое значение показывается один раз и в базе не хранится. **/
export type TCreateWorkspaceInviteToken = Pick<TWorkspaceInvite, 'expiresAt'> & {
  inviteToken: string;
};

/** Ответ на запрос на генерацию инвайта. **/
export type TCreateWorkspaceInviteResponse = TSuccessResponse<TCreateWorkspaceInviteToken>;
