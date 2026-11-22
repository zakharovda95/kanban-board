import { Module } from '@nestjs/common';

import UserMapper from '@/modules/user/libs/mappers/user.mapper';
import UserPermissionMapper from '@/modules/user/libs/mappers/user-permission.mapper';

@Module({
  providers: [UserMapper, UserPermissionMapper],
  exports: [UserMapper, UserPermissionMapper],
})
export default class UserMapperModule {}
