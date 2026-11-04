import { Module } from '@nestjs/common';

import UserMapperModule from '@/modules/user/libs/mappers/user-mapper.module';
import WorkspaceMapper from '@/modules/workspace/libs/mappers/workspace.mapper';
import WorkspaceInviteMapper from '@/modules/workspace/libs/mappers/workspace-invite.mapper';

@Module({
  imports: [UserMapperModule],
  providers: [WorkspaceMapper, WorkspaceInviteMapper],
  exports: [WorkspaceMapper, WorkspaceInviteMapper],
})
export default class WorkspaceMapperModule {}
