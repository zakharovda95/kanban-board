import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import BoardMapperModule from '@/modules/board/libs/mappers/board-mapper.module';
import ColumnGateway from '@/modules/column/column.gateway';
import ColumnService from '@/modules/column/column.service';
import ColumnEntity from '@/modules/column/libs/entities/column.entity';
import ColumnMapperModule from '@/modules/column/libs/mappers/column-mapper.module';
import MoveModule from '@/modules/shared/move/move.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ColumnEntity]),
    MoveModule,
    BoardMapperModule,
    ColumnMapperModule,
  ],
  controllers: [],
  providers: [ColumnService, ColumnGateway],
  exports: [ColumnService],
})
export default class ColumnModule {}
