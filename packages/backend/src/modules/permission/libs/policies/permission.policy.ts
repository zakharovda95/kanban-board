import { isOwner, type TUser } from '@kanban-board/common';
import { Policy } from '@nestjs/authorization';

@Policy()
export default class PermissionPolicy {
  public getPermissions(user: TUser | null): boolean {
    return isOwner(user);
  }

  public updatePermission(user: TUser | null): boolean {
    return isOwner(user);
  }
}
