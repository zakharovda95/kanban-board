import {
  positiveIdSchema,
  type TPositiveIdSchema,
  type TSuccessResponse,
  type TUpdateUserBodySchema,
  type TUpdateUserPermissionBodySchema,
  type TUpdateUserResponse,
  type TUser,
  type TUserBase,
  type TUserPermissions,
  updateUserBodySchema,
  updateUserPermissionBodySchema,
} from '@kanban-board/common';
import { Authenticate, CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';

import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
import UserService from '@/modules/user/user.service';
import UserPermissionService from '@/modules/user/user-permission.service';

@Controller('users')
@UsePipes(CustomValidationPipe.httpStandardSchemaPipe)
export default class UserController {
  constructor(
    private userService: UserService,
    private userPermissionService: UserPermissionService,
  ) {}

  @Can.Anyone()
  @Get(':userId')
  public async getUserById(
    @Param('userId', { schema: positiveIdSchema }) userId: TPositiveIdSchema,
  ): Promise<TUser> {
    return await this.userService.getUserBy(userId);
  }

  @Can.Anyone()
  @Get(':userId/permissions')
  public async getUserPermissions(
    @Param('userId', { schema: positiveIdSchema }) userId: TPositiveIdSchema,
  ): Promise<TUserPermissions> {
    return await this.userPermissionService.getUserPermissions(userId);
  }

  @Can.Anyone()
  @Post(':userId/permissions')
  public async updateUserPermissions(
    @Param('userId', { schema: positiveIdSchema }) userId: TPositiveIdSchema,
    @Body({ schema: updateUserPermissionBodySchema }) body: TUpdateUserPermissionBodySchema,
  ): Promise<TSuccessResponse> {
    await this.userPermissionService.updateUserPermissions(userId, body);
    return getSuccessResponse();
  }

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
  @Delete(':userId')
  public async deleteUser(
    @Param('userId', { schema: positiveIdSchema }) userId: TPositiveIdSchema,
  ): Promise<TSuccessResponse> {
    await this.userService.deleteUser(userId);
    return getSuccessResponse();
  }
}
