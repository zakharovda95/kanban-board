import type { TSuccessResponse, TUser } from '@kanban-board/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { Controller, Delete, UsePipes } from '@nestjs/common';

import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import { getSuccessResponse } from '@/libs/utilities/response.utilities';
import WorkspaceService from '@/modules/workspace/workspace.service';

@Controller('workspaces')
@UsePipes(CustomValidationPipe.httpStandardSchemaPipe)
export default class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Can.Anyone()
  @Delete()
  public async deleteWorkspace(@CurrentUser() me: TUser): Promise<TSuccessResponse> {
    await this.workspaceService.deleteWorkspace(me.userWorkspace.workspaceId);
    return getSuccessResponse();
  }
}
