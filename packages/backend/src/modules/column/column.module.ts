import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import BoardModule from '@/modules/board/board.module';
import ColumnGateway from '@/modules/column/column.gateway';
import ColumnService from '@/modules/column/column.service';
import ColumnEntity from '@/modules/column/libs/entities/column.entity';
import ColumnMapperModule from '@/modules/column/libs/mappers/column-mapper.module';
import ColumnPolicy from '@/modules/column/libs/policies/column.policy';
import MoveModule from '@/modules/shared/move/move.module';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnEntity]), MoveModule, ColumnMapperModule, BoardModule],
  providers: [ColumnService, ColumnGateway, ColumnPolicy],
  exports: [ColumnService],
})
export default class ColumnModule {}
