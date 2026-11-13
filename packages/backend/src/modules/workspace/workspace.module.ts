import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserMapperModule from '@/modules/user/libs/mappers/user-mapper.module';
import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';
import WorkspaceInviteEntity from '@/modules/workspace/libs/entities/workspace-invite.entity';
import WorkspaceMapperModule from '@/modules/workspace/libs/mappers/workspace-mapper.module';
import WorkspaceController from '@/modules/workspace/workspace.controller';
import WorkspaceGateway from '@/modules/workspace/workspace.gateway';
import WorkspaceService from '@/modules/workspace/workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity, WorkspaceInviteEntity]),
    WorkspaceMapperModule,
    UserMapperModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceGateway],
  exports: [WorkspaceService],
})
export default class WorkspaceModule {}
