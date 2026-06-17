import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColumnController } from '@/modules/column/column.controller';
import { ColumnMapper } from '@/modules/column/column.mapper';
import { ColumnService } from '@/modules/column/column.service';
import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import { IssueModule } from '@/modules/issue/issue.module';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnEntity]), IssueModule],
  controllers: [ColumnController],
  providers: [ColumnService, ColumnMapper],
  exports: [ColumnService, ColumnMapper],
})
export class ColumnModule {}
