import {
  EPermissionType,
  EProfilePermissionField,
  isOwner,
  type TUser,
} from '@kanban-board/common';
import { Policy } from '@nestjs/authorization';

import PermissionService from '@/modules/permission/permission.service';

@Policy()
export default class UserPolicy {
  constructor(private permissionService: PermissionService) {}

  public async updateMe(user: TUser | null): Promise<boolean> {
    if (!user) return false;
    return this.permissionService.checkPermission(
      user,
      EPermissionType.PROFILE,
      EProfilePermissionField.PROFILE_UPDATE,
    );
  }

  public async deleteMe(user: TUser | null): Promise<boolean> {
    if (!user) return false;
    return this.permissionService.checkPermission(
      user,
      EPermissionType.PROFILE,
      EProfilePermissionField.PROFILE_DELETE,
    );
  }

  public getUserById(user: TUser | null): boolean {
    return isOwner(user);
  }

  public deleteUser(user: TUser | null): boolean {
    return isOwner(user);
  }
}
