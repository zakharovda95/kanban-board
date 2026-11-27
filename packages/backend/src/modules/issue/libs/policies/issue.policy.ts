import { EBoardAccessPermissionField, EPermissionType, type TUser } from '@kanban-board/common';
import { Policy } from '@nestjs/authorization';

import { parsePositiveId } from '@/libs/utilities/id.utilities';
import BoardService from '@/modules/board/board.service';
import PermissionService from '@/modules/permission/permission.service';

@Policy()
export default class IssuePolicy {
  constructor(
    private permissionService: PermissionService,
    private boardService: BoardService,
  ) {}

  public async getIssueById(user: TUser | null, issueId: string): Promise<boolean> {
    const id = parsePositiveId(issueId);
    if (!id) return false;

    const boardId = await this.boardService.getBoardIdBy({ issueId: id });
    if (!boardId) return false;

    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.BOARD_VIEW);
  }

  public async createIssue(user: TUser | null, boardId: string): Promise<boolean> {
    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.ISSUE_CREATE);
  }

  public async updateIssue(user: TUser | null, issueId: string): Promise<boolean> {
    const id = parsePositiveId(issueId);
    if (!id) return false;

    const boardId = await this.boardService.getBoardIdBy({ issueId: id });
    if (!boardId) return false;

    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.ISSUE_UPDATE);
  }

  public async deleteIssue(user: TUser | null, issueId: string): Promise<boolean> {
    const id = parsePositiveId(issueId);
    if (!id) return false;

    const boardId = await this.boardService.getBoardIdBy({ issueId: id });
    if (!boardId) return false;

    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.ISSUE_DELETE);
  }

  public async moveIssue(user: TUser | null, boardId: string): Promise<boolean> {
    return this.checkBoardAccess(user, boardId, EBoardAccessPermissionField.ISSUE_MOVE);
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
