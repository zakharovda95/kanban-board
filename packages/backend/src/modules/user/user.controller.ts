import {
  type TMe,
  type TUpdateUserBodySchema,
  type TUpdateUserResponse,
  type TUser,
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
  public async getMe(@CurrentUser() me: TUser | null): Promise<TMe | null> {
    if (!me) return null;
    const myWorkspace = await this.userService.getUserWorkspaceByUserId(me.id);
    if (!myWorkspace) return null;

    return { me, myWorkspace };
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
