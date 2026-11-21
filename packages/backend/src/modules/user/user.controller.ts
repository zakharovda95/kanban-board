import {
  positiveIdSchema,
  type TPositiveIdSchema,
  type TSuccessResponse,
  type TUpdateUserBodySchema,
  type TUpdateUserResponse,
  type TUser,
  type TUserBase,
  updateUserBodySchema,
} from '@kanban-board/common';
import { Authenticate, CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { Body, Controller, Delete, Get, Param, Patch, UsePipes } from '@nestjs/common';

import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
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

  @Can.Anyone()
  @Patch('me')
  public async updateMe(
    @CurrentUser() me: TUser,
    @Body({ schema: updateUserBodySchema }) body: TUpdateUserBodySchema,
  ): Promise<TUpdateUserResponse> {
    const updatedUser = await this.userService.updateUser(me.id, body);
    return getSuccessResponseWithData<TUserBase>(updatedUser);
  }

  @Can.Anyone()
  public async getUserById(
    @Param('userId', { schema: positiveIdSchema }) userId: TPositiveIdSchema,
  ): Promise<TUser> {
    return await this.userService.getUserBy(userId);
  }

  @Can.Anyone()
  @Delete(':userId')
  public async deleteUser(
    @Param('userId', { schema: positiveIdSchema }) userId: TPositiveIdSchema,
  ): Promise<TSuccessResponse> {
    await this.userService.deleteUser(userId);
    return getSuccessResponse();
  }
}
