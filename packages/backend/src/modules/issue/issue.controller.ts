import type { TSuccessResponse } from '@kanban-board/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { IssueService } from '@/modules/issue/issue.service';
import { CreateIssueDto } from '@/modules/issue/libs/dtos/create-issue.dto';
import { MoveIssueDto } from '@/modules/issue/libs/dtos/move-issue.dto';
import { PatchIssueDto } from '@/modules/issue/libs/dtos/patch-issue.dto';
import type { TCreateIssueResponse, TIssue } from '@/modules/issue/libs/types/issue.types';
import { MovePipe } from '@/modules/shared/move/libs/pipes/move.pipe';

@Controller()
export class IssueController {
  constructor(private issueService: IssueService) {}

  @Get('issues/:issueId')
  public async getIssueById(@Param('issueId', ParseIntPipe) issueId: number): Promise<TIssue> {
    return this.issueService.getIssueById(issueId);
  }

  @Post('boards/:boardId/columns/:columnId/issues')
  public async createIssue(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() body: CreateIssueDto,
  ): Promise<TCreateIssueResponse> {
    return await this.issueService.createIssue(boardId, columnId, body);
  }

  @Post('boards/:boardId/columns/:fromColumnId/issues/:issueId/move')
  @HttpCode(HttpStatus.OK)
  public async moveIssue(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('fromColumnId', ParseIntPipe) fromColumnId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body(MovePipe) body: MoveIssueDto,
  ): Promise<TSuccessResponse> {
    return await this.issueService.moveIssue(boardId, fromColumnId, issueId, body);
  }

  @Patch('issues/:issueId')
  public async patchIssue(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() body: PatchIssueDto,
  ): Promise<TSuccessResponse> {
    return await this.issueService.patchIssue(issueId, body);
  }

  @Delete('issues/:issueId')
  public async deleteIssue(
    @Param('issueId', ParseIntPipe) issueId: number,
  ): Promise<TSuccessResponse> {
    return await this.issueService.deleteIssue(issueId);
  }
}
