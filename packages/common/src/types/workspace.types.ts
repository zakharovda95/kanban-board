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
