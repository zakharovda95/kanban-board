import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserMapperModule from '@/modules/user/libs/mappers/user-mapper.module';
import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';
import WorkspaceInviteEntity from '@/modules/workspace/libs/entities/workspace-invite.entity';
import WorkspaceMapperModule from '@/modules/workspace/libs/mappers/workspace-mapper.module';
import WorkspacePolicy from '@/modules/workspace/libs/policies/workspace.policy';
import WorkspaceController from '@/modules/workspace/workspace.controller';
import WorkspaceGateway from '@/modules/workspace/workspace.gateway';
import WorkspaceService from '@/modules/workspace/workspace.service';
import WorkspaceInviteService from '@/modules/workspace/workspace-invite.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity, WorkspaceInviteEntity]),
    WorkspaceMapperModule,
    UserMapperModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceInviteService, WorkspaceGateway, WorkspacePolicy],
  exports: [WorkspaceService, WorkspaceInviteService],
})
export default class WorkspaceModule {}
