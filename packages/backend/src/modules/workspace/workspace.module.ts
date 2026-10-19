import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
})
export default class WorkspaceModule {}
