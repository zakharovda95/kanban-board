import { Module } from '@nestjs/common';

import PermissionMapper from '@/modules/permission/libs/mappers/permission.mapper';

@Module({
  providers: [PermissionMapper],
  exports: [PermissionMapper],
})
export default class PermissionMapperModule {}
