import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColumnsController } from '@/modules/columns/columns.controller';
import { ColumnsService } from '@/modules/columns/columns.service';
import { ColumnEntity } from '@/modules/columns/libs/entities/column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnEntity])],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
