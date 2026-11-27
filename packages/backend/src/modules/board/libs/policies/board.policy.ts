import {
  EBoardAccessPermissionField,
  EBoardPermissionField,
  EPermissionType,
  type TUser,
} from '@kanban-board/common';
import { Policy } from '@nestjs/authorization';

import { parsePositiveId } from '@/libs/utilities/id.utilities';
import PermissionService from '@/modules/permission/permission.service';

@Policy()
export default class BoardPolicy {
  constructor(private permissionService: PermissionService) {}

  public async joinRoom(user: TUser | null, boardId: string): Promise<boolean> {
    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.BOARD_VIEW);
  }

  public async getBoardById(user: TUser | null, boardId: string): Promise<boolean> {
    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.BOARD_VIEW);
  }

  public async createBoard(user: TUser | null): Promise<boolean> {
    if (!user) return false;
    return this.permissionService.checkPermission(
      user,
      EPermissionType.BOARD,
      EBoardPermissionField.BOARDS_CREATE,
    );
  }

  public async updateBoard(user: TUser | null, boardId: string): Promise<boolean> {
    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.BOARD_UPDATE);
  }

  public async deleteBoard(user: TUser | null, boardId: string): Promise<boolean> {
    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.BOARD_DELETE);
  }

  public async moveBoard(user: TUser | null): Promise<boolean> {
    if (!user) return false;
    return this.permissionService.checkPermission(
      user,
      EPermissionType.BOARD,
      EBoardPermissionField.BOARDS_MOVE,
    );
  }

  private async checkBoardAccess(
    user: TUser | null,
    boardId: string,
    field: EBoardAccessPermissionField,
  ): Promise<boolean> {
    if (!user) return false;

    const id = parsePositiveId(boardId);
    if (!id) return false;

    return this.permissionService.checkPermission(user, EPermissionType.BOARD_ACCESSES, field, id);
  }
}
