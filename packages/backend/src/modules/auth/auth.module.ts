import { Module } from '@nestjs/common';

import AuthController from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import UserModule from '@/modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export default class AuthModule {}
