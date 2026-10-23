import { Module } from '@nestjs/common';

import AuthController from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import UserModule from '@/modules/user/user.module';
import WorkspaceModule from '@/modules/workspace/workspace.module';

@Module({
  imports: [UserModule, WorkspaceModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export default class AuthModule {}
