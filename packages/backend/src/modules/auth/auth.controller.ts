import {
  authLoginBodySchema,
  authRegisterBodySchema,
  type TAuthData,
  type TAuthLoginBodySchema,
  type TAuthLoginPayload,
  type TAuthLoginResponse,
  type TAuthRegisterBodySchema,
  type TAuthRegisterResponse,
} from '@kanban-board/common';
import { Body, Controller, Post } from '@nestjs/common';

import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';
import { AuthService } from '@/modules/auth/auth.service';

@Controller('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  public async register(
    @Body({ schema: authRegisterBodySchema }) body: TAuthRegisterBodySchema,
  ): Promise<TAuthRegisterResponse> {
    const authData = await this.authService.register(body);
    return getSuccessResponseWithData<TAuthData>(authData);
  }

  @Post('login')
  public async login(
    @Body({ schema: authLoginBodySchema }) body: TAuthLoginBodySchema,
  ): Promise<TAuthLoginResponse> {
    const loginPayload = await this.authService.login(body);
    return getSuccessResponseWithData<TAuthLoginPayload>(loginPayload);
  }
}
