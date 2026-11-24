import { isOwner, type TUser } from '@kanban-board/common';
import { Policy } from '@nestjs/authorization';

@Policy()
export default class WorkspacePolicy {
  public getWorkspace(user: TUser | null): boolean {
    return isOwner(user);
  }

  public deleteWorkspace(user: TUser | null): boolean {
    return isOwner(user);
  }

  public createInvite(user: TUser | null): boolean {
    return isOwner(user);
  }

  public deleteInvite(user: TUser | null): boolean {
    return isOwner(user);
  }
}
