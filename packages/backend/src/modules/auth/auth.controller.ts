import {
  authLoginBodySchema,
  authRegisterBodySchema,
  type TAuthLoginBodySchema,
  type TAuthRegisterBodySchema,
  type TAuthRegisterResponse,
  type TSuccessResponse,
} from '@kanban-board/common';
import { Public } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
import { AuthService } from '@/modules/auth/auth.service';

@Controller('auth')
@UsePipes(CustomValidationPipe.httpStandardSchemaPipe)
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  public async register(
    @Body({ schema: authRegisterBodySchema }) body: TAuthRegisterBodySchema,
  ): Promise<TAuthRegisterResponse> {
    const authData = await this.authService.register(body);
    return getSuccessResponseWithData<TAuthLoginBodySchema>(authData);
  }

  @Public()
  @Post('login')
  public async login(@Body({ schema: authLoginBodySchema }) body: TAuthLoginBodySchema) {
    await this.authService.login(body);
    return getSuccessResponse();
  }

  @Can.Anyone()
  @Post('logout')
  public async logout(): Promise<TSuccessResponse> {
    await this.authService.logout();
    return getSuccessResponse();
  }
}
