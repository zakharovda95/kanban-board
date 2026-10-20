import type {
  TAuthData,
  TAuthLoginPayload,
  TAuthLoginResponse,
  TAuthRegisterResponse,
} from '@kanban-board/common';
import { Body, Controller, Post } from '@nestjs/common';

import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';
import { AuthService } from '@/modules/auth/auth.service';
import AuthLoginDto from '@/modules/auth/libs/dtos/auth-login.dto';
import AuthRegisterDto from '@/modules/auth/libs/dtos/auth-register.dto';

@Controller('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  public async register(@Body() body: AuthRegisterDto): Promise<TAuthRegisterResponse> {
    const authData = await this.authService.register(body);
    return getSuccessResponseWithData<TAuthData>(authData);
  }

  @Post('login')
  public async login(@Body() body: AuthLoginDto): Promise<TAuthLoginResponse> {
    const loginPayload = await this.authService.login(body);
    return getSuccessResponseWithData<TAuthLoginPayload>(loginPayload);
  }
}
