import { Module } from '@nestjs/common';

import UserMapper from '@/modules/user/libs/mappers/user.mapper';
import UserWorkspaceMapper from '@/modules/user/libs/mappers/user-workspace.mapper';

@Module({
  providers: [UserMapper, UserWorkspaceMapper],
  exports: [UserMapper],
})
export default class UserMapperModule {}
