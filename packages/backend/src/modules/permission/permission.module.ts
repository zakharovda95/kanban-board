import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import BoardAccessPermissionEntity from '@/modules/permission/libs/entities/board-access-permission.entity';
import BoardPermissionEntity from '@/modules/permission/libs/entities/board-permission.entity';
import ProfilePermissionEntity from '@/modules/permission/libs/entities/profile-permission.entity';
import PermissionMapperModule from '@/modules/permission/libs/mappers/permission-mapper.module';
import PermissionPolicy from '@/modules/permission/libs/policies/permission.policy';
import PermissionService from '@/modules/permission/permission.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProfilePermissionEntity,
      BoardPermissionEntity,
      BoardAccessPermissionEntity,
    ]),
    PermissionMapperModule,
  ],
  providers: [PermissionService, PermissionPolicy],
  exports: [PermissionService, PermissionPolicy],
})
export default class PermissionModule {}
