import { Module } from '@nestjs/common';

import WorkspaceMapper from '@/modules/workspace/libs/mappers/workspace.mapper';

@Module({
  providers: [WorkspaceMapper],
  exports: [WorkspaceMapper],
})
export default class WorkspaceMapperModule {}
