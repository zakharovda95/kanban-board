import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssueController } from '@/modules/issue/issue.controller';
import IssueGateway from '@/modules/issue/issue.gateway';
import { IssueMapper } from '@/modules/issue/issue.mapper';
import { IssueService } from '@/modules/issue/issue.service';
import { IssueEntity } from '@/modules/issue/libs/entities/issue.entity';
import { MoveModule } from '@/modules/shared/move/move.module';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity]), MoveModule],
  controllers: [IssueController],
  providers: [IssueService, IssueMapper, IssueGateway],
  exports: [IssueService, IssueMapper],
})
export class IssueModule {}
