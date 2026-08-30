import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ColumnMapperModule from '@/modules/column/libs/mappers/column-mapper.module';
import IssueController from '@/modules/issue/issue.controller';
import IssueGateway from '@/modules/issue/issue.gateway';
import IssueService from '@/modules/issue/issue.service';
import IssueEntity from '@/modules/issue/libs/entities/issue.entity';
import IssueMapperModule from '@/modules/issue/libs/mappers/issue-mapper.module';
import MoveModule from '@/modules/shared/move/move.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IssueEntity]),
    MoveModule,
    ColumnMapperModule,
    IssueMapperModule,
  ],
  controllers: [IssueController],
  providers: [IssueService, IssueGateway],
  exports: [IssueService],
})
export default class IssueModule {}
