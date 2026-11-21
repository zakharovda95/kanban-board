import { Module } from '@nestjs/common';

import BoardAccessPermissionMapper from '@/modules/permission/libs/mappers/board-access-permission.mapper';
import BoardPermissionMapper from '@/modules/permission/libs/mappers/board-permission.mapper';
import ProfilePermissionMapper from '@/modules/permission/libs/mappers/profile-permission.mapper';

@Module({
  providers: [BoardAccessPermissionMapper, BoardPermissionMapper, ProfilePermissionMapper],
  exports: [BoardAccessPermissionMapper, BoardPermissionMapper, ProfilePermissionMapper],
})
export default class PermissionMapperModule {}
