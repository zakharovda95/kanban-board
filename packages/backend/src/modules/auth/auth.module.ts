import { AuthenticationModule } from '@nestjs/authentication';
import { AuthorizationModule } from '@nestjs/authorization';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AuthController from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import AuthSessionProvider from '@/modules/auth/auth-session.provider';
import AuthSessionStore from '@/modules/auth/auth-session.store';
import { AuthSessionEntity } from '@/modules/auth/libs/entities/auth-session.entity';
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
    AuthorizationModule.forRoot(),
    TypeOrmModule.forFeature([AuthSessionEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthSessionProvider, AuthSessionStore],
  exports: [AuthService],
})
export default class AuthModule {}
