import { AuthenticationModule } from '@nestjs/authentication';
import { Module } from '@nestjs/common';

import AuthController from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import AuthSessionProvider from '@/modules/auth/auth-session.provider';
import UserModule from '@/modules/user/user.module';
import WorkspaceModule from '@/modules/workspace/workspace.module';

@Module({
  imports: [
    UserModule,
    WorkspaceModule,
    AuthenticationModule.forRoot({
      session: {
        absoluteTtl: '1d',
        idleTtl: '4h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthSessionProvider],
  exports: [AuthService],
})
export default class AuthModule {}
