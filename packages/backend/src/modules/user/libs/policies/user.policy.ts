import { isOwner, type TUser } from '@kanban-board/common';
import { Policy } from '@nestjs/authorization';

@Policy()
export default class UserPolicy {
  public updateMe(user: TUser | null): boolean {
    return isOwner(user);
  }

  public getUserById(user: TUser | null): boolean {
    return isOwner(user);
  }

  public deleteUser(user: TUser | null): boolean {
    return isOwner(user);
  }
}
