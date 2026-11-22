import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import BoardAccessUserPermissionEntity from '@/modules/user/libs/entities/board-access-user-permission.entity';
import BoardUserPermissionEntity from '@/modules/user/libs/entities/board-user-permission.entity';
import ProfileUserPermissionEntity from '@/modules/user/libs/entities/profile-user-permission.entity';
import UserEntity from '@/modules/user/libs/entities/user.entity';
import UserMapperModule from '@/modules/user/libs/mappers/user-mapper.module';
import UserController from '@/modules/user/user.controller';
import UserService from '@/modules/user/user.service';
import UserPermissionService from '@/modules/user/user-permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProfileUserPermissionEntity,
      BoardUserPermissionEntity,
      BoardAccessUserPermissionEntity,
    ]),
    UserMapperModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserPermissionService],
  exports: [UserService, UserPermissionService],
})
export default class UserModule {}
