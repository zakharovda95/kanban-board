import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserEntity from '@/modules/user/libs/entities/user.entity';
import UserController from '@/modules/user/user.controller';
import UserService from '@/modules/user/user.service';
import WorkspaceModule from '@/modules/workspace/workspace.module';

@Module({
  imports: [WorkspaceModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export default class UserModule {}
