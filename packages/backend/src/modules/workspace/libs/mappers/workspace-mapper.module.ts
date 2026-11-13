import { Module } from '@nestjs/common';

import WorkspaceMapper from '@/modules/workspace/libs/mappers/workspace.mapper';
import WorkspaceInviteMapper from '@/modules/workspace/libs/mappers/workspace-invite.mapper';

@Module({
  providers: [WorkspaceMapper, WorkspaceInviteMapper],
  exports: [WorkspaceMapper, WorkspaceInviteMapper],
})
export default class WorkspaceMapperModule {}
