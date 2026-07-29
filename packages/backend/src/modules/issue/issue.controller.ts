import type { TCreateIssueResponse, TIssue, TSuccessResponse } from '@kanban-board/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import ParameterIdPipe from '@/libs/pipes/parameter-id.pipe';
import { IssueService } from '@/modules/issue/issue.service';
import { CreateIssueDto } from '@/modules/issue/libs/dtos/create-issue.dto';
import { MoveIssueDto } from '@/modules/issue/libs/dtos/move-issue.dto';
import { PatchIssueDto } from '@/modules/issue/libs/dtos/patch-issue.dto';
import { MovePipe } from '@/modules/shared/move/libs/pipes/move.pipe';

@Controller()
export class IssueController {
  constructor(private issueService: IssueService) {}

  @Get('boards/:boardId/columns/:columnId/issues/:issueId')
  public async getIssueById(
    @Param('boardId', ParameterIdPipe) boardId: number,
    @Param('columnId', ParameterIdPipe) columnId: number,
    @Param('issueId', ParameterIdPipe) issueId: number,
  ): Promise<TIssue> {
    return this.issueService.getIssueById(boardId, columnId, issueId);
  }

  @Post('boards/:boardId/columns/:columnId/issues')
  public async createIssue(
    @Param('boardId', ParameterIdPipe) boardId: number,
    @Param('columnId', ParameterIdPipe) columnId: number,
    @Body() body: CreateIssueDto,
  ): Promise<TCreateIssueResponse> {
    return await this.issueService.createIssue(boardId, columnId, body);
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

  @Patch('boards/:boardId/columns/:columnId/issues/:issueId')
  public async patchIssue(
    @Param('boardId', ParameterIdPipe) boardId: number,
    @Param('columnId', ParameterIdPipe) columnId: number,
    @Param('issueId', ParameterIdPipe) issueId: number,
    @Body() body: PatchIssueDto,
  ): Promise<TSuccessResponse> {
    return await this.issueService.patchIssue(boardId, columnId, issueId, body);
  }

  @Delete('boards/:boardId/columns/:columnId/issues/:issueId')
  public async deleteIssue(
    @Param('boardId', ParameterIdPipe) boardId: number,
    @Param('columnId', ParameterIdPipe) columnId: number,
    @Param('issueId', ParameterIdPipe) issueId: number,
  ): Promise<TSuccessResponse> {
    return await this.issueService.deleteIssue(boardId, columnId, issueId);
  }
}
