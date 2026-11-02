import {
  type TUpdateUserBodySchema,
  type TUpdateUserResponse,
  type TUser,
  type TUserWorkspace,
  updateUserBodySchema,
} from '@kanban-board/common';
import { Authenticate, CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { Body, Controller, Get, Patch, UsePipes } from '@nestjs/common';

import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';
import UserService from '@/modules/user/user.service';

@Controller('users')
@UsePipes(CustomValidationPipe.httpStandardSchemaPipe)
export default class UserController {
  constructor(private userService: UserService) {}

  @Authenticate({ optional: true })
  @Can.Anyone()
  @Get('me')
  public getMe(@CurrentUser() me: TUser | null): TUser | null {
    return me;
  }

  @Authenticate({ optional: true })
  @Can.Anyone()
  @Get('me/workspaces')
  public async getMyWorkspace(@CurrentUser() me: TUser | null): Promise<TUserWorkspace | null> {
    if (!me) return null;
    return await this.userService.getUserWorkspaceByUserId(me.id);
  }

  @Can.Anyone()
  @Patch('me')
  public async updateMe(
    @CurrentUser() me: TUser,
    @Body({ schema: updateUserBodySchema }) body: TUpdateUserBodySchema,
  ): Promise<TUpdateUserResponse> {
    const updatedUser = await this.userService.updateUser(me.id, body);
    return getSuccessResponseWithData<TUser>(updatedUser);
  }
}
