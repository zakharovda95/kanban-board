import type { TIssue, TSuccessResponse } from '@kanban-board/common';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';

import ParameterIdPipe from '@/libs/pipes/parameter-id.pipe';
import { IssueService } from '@/modules/issue/issue.service';
import { MoveIssueDto } from '@/modules/issue/libs/dtos/move-issue.dto';
import { MovePipe } from '@/modules/shared/move/libs/pipes/move.pipe';

@Controller()
export class IssueController {
  constructor(private issueService: IssueService) {}

  @Get('issues/:issueId')
  public async getIssueById(@Param('issueId', ParameterIdPipe) issueId: number): Promise<TIssue> {
    return this.issueService.getIssueById(issueId);
  }

  @Post('boards/:boardId/columns/:fromColumnId/issues/:issueId/move')
  @HttpCode(HttpStatus.OK)
  public async moveIssue(
    @Param('boardId', ParameterIdPipe) boardId: number,
    @Param('fromColumnId', ParameterIdPipe) fromColumnId: number,
    @Param('issueId', ParameterIdPipe) issueId: number,
    @Body(MovePipe) body: MoveIssueDto,
  ): Promise<TSuccessResponse> {
    return await this.issueService.moveIssue(boardId, fromColumnId, issueId, body);
  }
}
