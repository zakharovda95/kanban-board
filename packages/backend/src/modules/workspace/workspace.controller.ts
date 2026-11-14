import {
  createWorkspaceInviteBodySchema,
  positiveIdSchema,
  type TCreateWorkspaceInviteBodySchema,
  type TCreateWorkspaceInviteResponse,
  type TCreateWorkspaceInviteToken,
  type TPositiveIdSchema,
  type TSuccessResponse,
  type TUser,
  type TWorkspace,
} from '@kanban-board/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { Body, Controller, Delete, Get, Param, Post, UsePipes } from '@nestjs/common';

import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
import WorkspaceService from '@/modules/workspace/workspace.service';
import WorkspaceInviteService from '@/modules/workspace/workspace-invite.service';

@Controller('workspaces')
@UsePipes(CustomValidationPipe.httpStandardSchemaPipe)
export default class WorkspaceController {
  constructor(
    private workspaceService: WorkspaceService,
    private workspaceInviteService: WorkspaceInviteService,
  ) {}

  @Can.Anyone()
  @Get()
  public async getWorkspace(@CurrentUser() me: TUser): Promise<TWorkspace> {
    return await this.workspaceService.getWorkspace(me.userWorkspace.workspaceId);
  }

  @Can.Anyone()
  @Delete()
  public async deleteWorkspace(@CurrentUser() me: TUser): Promise<TSuccessResponse> {
    await this.workspaceService.deleteWorkspace(me.userWorkspace.workspaceId);
    return getSuccessResponse();
  }

  @Can.Anyone()
  @Post('invites')
  public async createInvite(
    @CurrentUser() me: TUser,
    @Body({ schema: createWorkspaceInviteBodySchema }) body: TCreateWorkspaceInviteBodySchema,
  ): Promise<TCreateWorkspaceInviteResponse> {
    const result = await this.workspaceInviteService.createInvite(
      me.userWorkspace.workspaceId,
      body,
    );
    return getSuccessResponseWithData<TCreateWorkspaceInviteToken>(result);
  }

  @Can.Anyone()
  @Delete('invites/:inviteId')
  public async deleteInvite(
    @Param('inviteId', { schema: positiveIdSchema }) inviteId: TPositiveIdSchema,
  ): Promise<TSuccessResponse> {
    await this.workspaceInviteService.deleteWorkspaceInvite(inviteId);
    return getSuccessResponse();
  }
}
