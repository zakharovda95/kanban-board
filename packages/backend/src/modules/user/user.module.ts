import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserEntity from '@/modules/user/libs/entities/user.entity';
import UserWorkspaceEntity from '@/modules/user/libs/entities/user-workspace.entity';
import UserMapperModule from '@/modules/user/libs/mappers/user-mapper.module';
import UserController from '@/modules/user/user.controller';
import UserService from '@/modules/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserWorkspaceEntity]), UserMapperModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export default class UserModule {}
