import {
  positiveIdSchema,
  type TPermissions,
  type TPositiveIdSchema,
  type TSuccessResponse,
  type TUpdatePermissionBodySchema,
  type TUpdateUserBodySchema,
  type TUpdateUserResponse,
  type TUser,
  type TUserBase,
  updatePermissionBodySchema,
  updateUserBodySchema,
} from '@kanban-board/common';
import { Authenticate, CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';

import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
import PermissionPolicy from '@/modules/permission/libs/policies/permission.policy';
import PermissionService from '@/modules/permission/permission.service';
import UserPolicy from '@/modules/user/libs/policies/user.policy';
import UserService from '@/modules/user/user.service';

@Controller('users')
@UsePipes(CustomValidationPipe.httpStandardSchemaPipe)
export default class UserController {
  constructor(
    private userService: UserService,
    private permissionService: PermissionService,
  ) {}

  @Can(UserPolicy, 'getUserById')
  @Get(':userId')
  public async getUserById(
    @Param('userId', { schema: positiveIdSchema }) userId: TPositiveIdSchema,
  ): Promise<TUser> {
    return await this.userService.getUserById(userId);
  }

  @Can(UserPolicy, 'deleteUser')
  @Delete(':userId')
  public async deleteUser(
    @Param('userId', { schema: positiveIdSchema }) userId: TPositiveIdSchema,
  ): Promise<TSuccessResponse> {
    await this.userService.deleteUser(userId);
    return getSuccessResponse();
  }

  @Can(PermissionPolicy, 'getPermissions')
  @Get(':userId/permissions')
  public async getPermissions(
    @Param('userId', { schema: positiveIdSchema }) userId: TPositiveIdSchema,
  ): Promise<TPermissions> {
    return await this.permissionService.getPermissions(userId);
  }

  @Can(PermissionPolicy, 'updatePermission')
  @Post(':userId/permissions')
  public async updatePermission(
    @Param('userId', { schema: positiveIdSchema }) userId: TPositiveIdSchema,
    @Body({ schema: updatePermissionBodySchema }) body: TUpdatePermissionBodySchema,
  ): Promise<TSuccessResponse> {
    await this.permissionService.updatePermission(userId, body);
    return getSuccessResponse();
  }

  @Authenticate({ optional: true })
  @Can.Anyone()
  @Get('me')
  public getMe(@CurrentUser() me: TUser | null): TUser | null {
    return me;
  }

  @Can(UserPolicy, 'updateMe')
  @Patch('me')
  public async updateMe(
    @CurrentUser() me: TUser,
    @Body({ schema: updateUserBodySchema }) body: TUpdateUserBodySchema,
  ): Promise<TUpdateUserResponse> {
    const updatedUser = await this.userService.updateUser(me.id, body);
    return getSuccessResponseWithData<TUserBase>(updatedUser);
  }

  @Can(UserPolicy, 'deleteMe')
  @Delete('me')
  public async deleteMe(@CurrentUser() me: TUser): Promise<TSuccessResponse> {
    await this.userService.deleteUser(me.id);
    return getSuccessResponse();
  }

  @Can.Anyone()
  @Get('me/permissions')
  public async getMyPermissions(@CurrentUser() me: TUser): Promise<TPermissions> {
    return await this.permissionService.getPermissions(me.id);
  }
}
