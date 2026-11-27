import { EBoardAccessPermissionField, EPermissionType, type TUser } from '@kanban-board/common';
import { Policy } from '@nestjs/authorization';

import { parsePositiveId } from '@/libs/utilities/id.utilities';
import BoardService from '@/modules/board/board.service';
import PermissionService from '@/modules/permission/permission.service';

@Policy()
export default class ColumnPolicy {
  constructor(
    private permissionService: PermissionService,
    private boardService: BoardService,
  ) {}

  public async createColumn(user: TUser | null, boardId: string): Promise<boolean> {
    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.COLUMN_CREATE);
  }

  public async updateColumn(user: TUser | null, columnId: string): Promise<boolean> {
    const id = parsePositiveId(columnId);
    if (!id) return false;

    const boardId = await this.boardService.getBoardIdBy({ columnId: id });
    if (!boardId) return false;

    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.COLUMN_UPDATE);
  }

  public async deleteColumn(user: TUser | null, columnId: string): Promise<boolean> {
    const id = parsePositiveId(columnId);
    if (!id) return false;

    const boardId = await this.boardService.getBoardIdBy({ columnId: id });
    if (!boardId) return false;

    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.COLUMN_DELETE);
  }

  public async moveColumn(user: TUser | null, boardId: string): Promise<boolean> {
    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.COLUMN_MOVE);
  }

  private async checkBoardAccess(
    user: TUser | null,
    boardId: string | number,
    field: EBoardAccessPermissionField,
  ): Promise<boolean> {
    if (!user) return false;

    const id = parsePositiveId(boardId);
    if (!id) return false;

    return this.permissionService.checkPermission(user, EPermissionType.BOARD_ACCESSES, field, id);
  }
}
