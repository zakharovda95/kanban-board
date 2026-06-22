import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssueController } from '@/modules/issue/issue.controller';
import { IssueMapper } from '@/modules/issue/issue.mapper';
import { IssueService } from '@/modules/issue/issue.service';
import { IssueEntity } from '@/modules/issue/libs/entities/issue.entity';
import { MoveModule } from '@/modules/shared/move/move.module';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity]), MoveModule],
  controllers: [IssueController],
  providers: [IssueService, IssueMapper],
  exports: [IssueService, IssueMapper],
})
export class IssueModule {}
