import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import BoardAccessPermissionEntity from '@/modules/permission/libs/entities/board-access-permission.entity';
import BoardPermissionEntity from '@/modules/permission/libs/entities/board-permission.entity';
import ProfilePermissionEntity from '@/modules/permission/libs/entities/profile-permission.entity';
import PermissionMapperModule from '@/modules/permission/libs/mappers/permission-mapper.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BoardPermissionEntity,
      BoardAccessPermissionEntity,
      ProfilePermissionEntity,
    ]),
    PermissionMapperModule,
  ],
  providers: [],
  exports: [],
})
export default class PermissionModule {}
