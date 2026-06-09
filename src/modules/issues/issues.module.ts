import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssuesController } from '@/modules/issues/issues.controller';
import { IssuesMapper } from '@/modules/issues/issues.mapper';
import { IssuesService } from '@/modules/issues/issues.service';
import { IssueEntity } from '@/modules/issues/libs/entities/issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity])],
  controllers: [IssuesController],
  providers: [IssuesService, IssuesMapper],
  exports: [IssuesService, IssuesMapper],
})
export class IssuesModule {}
