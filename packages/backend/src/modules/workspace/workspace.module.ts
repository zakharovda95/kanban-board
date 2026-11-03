import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';
import WorkspaceMapperModule from '@/modules/workspace/libs/mappers/workspace-mapper.module';
import WorkspaceController from '@/modules/workspace/workspace.controller';
import WorkspaceGateway from '@/modules/workspace/workspace.gateway';
import WorkspaceService from '@/modules/workspace/workspace.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity]), WorkspaceMapperModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceGateway],
  exports: [WorkspaceService],
})
export default class WorkspaceModule {}
