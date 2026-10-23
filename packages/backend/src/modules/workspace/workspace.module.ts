import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';
import WorkspaceMapperModule from '@/modules/workspace/libs/mappers/workspace-mapper.module';
import WorkspaceService from '@/modules/workspace/workspace.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity]), WorkspaceMapperModule],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export default class WorkspaceModule {}
