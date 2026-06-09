import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColumnsController } from '@/modules/columns/columns.controller';
import { ColumnsMapper } from '@/modules/columns/columns.mapper';
import { ColumnsService } from '@/modules/columns/columns.service';
import { ColumnEntity } from '@/modules/columns/libs/entities/column.entity';
import { IssuesModule } from '@/modules/issues/issues.module';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnEntity]), IssuesModule],
  controllers: [ColumnsController],
  providers: [ColumnsService, ColumnsMapper],
  exports: [ColumnsService, ColumnsMapper],
})
export class ColumnsModule {}
