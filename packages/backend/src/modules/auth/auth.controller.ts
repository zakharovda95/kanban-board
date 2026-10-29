import {
  authLoginBodySchema,
  authRegisterBodySchema,
  type TAuthLoginBodySchema,
  type TAuthRegisterBodySchema,
  type TAuthRegisterResponse,
} from '@kanban-board/common';
import { Public } from '@nestjs/authentication';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
import { AuthService } from '@/modules/auth/auth.service';

@Public()
@Controller('auth')
@UsePipes(CustomValidationPipe.httpStandardSchemaPipe)
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  public async register(
    @Body({ schema: authRegisterBodySchema }) body: TAuthRegisterBodySchema,
  ): Promise<TAuthRegisterResponse> {
    const authData = await this.authService.register(body);
    return getSuccessResponseWithData<TAuthLoginBodySchema>(authData);
  }

  @Post('login')
  public async login(@Body({ schema: authLoginBodySchema }) body: TAuthLoginBodySchema) {
    await this.authService.login(body);
    return getSuccessResponse();
  }

  @Post('logout')
  public async logout() {
    await this.authService.logout();
    return getSuccessResponse();
  }
}
