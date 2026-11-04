import { Module } from '@nestjs/common';

import UserMapperModule from '@/modules/user/libs/mappers/user-mapper.module';
import WorkspaceMapper from '@/modules/workspace/libs/mappers/workspace.mapper';

@Module({
  imports: [UserMapperModule],
  providers: [WorkspaceMapper],
  exports: [WorkspaceMapper],
})
export default class WorkspaceMapperModule {}
