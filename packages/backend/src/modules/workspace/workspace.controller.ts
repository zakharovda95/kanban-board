import type { TSuccessResponse, TUser, TWorkspace } from '@kanban-board/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { Controller, Delete, Get, UsePipes } from '@nestjs/common';

import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import { getSuccessResponse } from '@/libs/utilities/response.utilities';
import WorkspaceService from '@/modules/workspace/workspace.service';

@Controller('workspaces')
@UsePipes(CustomValidationPipe.httpStandardSchemaPipe)
export default class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

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
}
