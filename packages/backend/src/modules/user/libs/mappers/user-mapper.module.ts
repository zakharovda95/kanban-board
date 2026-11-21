import { Module } from '@nestjs/common';

import PermissionMapperModule from '@/modules/permission/libs/mappers/permission-mapper.module';
import UserMapper from '@/modules/user/libs/mappers/user.mapper';

@Module({
  imports: [PermissionMapperModule],
  providers: [UserMapper],
  exports: [UserMapper],
})
export default class UserMapperModule {}
