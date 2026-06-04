import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssuesController } from '@/modules/issues/issues.controller';
import { IssuesService } from '@/modules/issues/issues.service';
import { IssueEntity } from '@/modules/issues/libs/entities/issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity])],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService],
})
export class IssuesModule {}
