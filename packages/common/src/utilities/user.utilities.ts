import { EUserWorkspaceRole } from '../enums/user.enums.js';
import type { TUser } from '../types/user.types.js';

export function isOwner(user: TUser | null | undefined): boolean {
  if (!user) return false;
  return user.workspaceRole === EUserWorkspaceRole.OWNER;
}
