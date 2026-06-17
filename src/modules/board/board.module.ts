import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardController } from '@/modules/board/board.controller';
import { BoardMapper } from '@/modules/board/board.mapper';
import { BoardService } from '@/modules/board/board.service';
import { BoardEntity } from '@/modules/board/libs/entities/board.entity';
import { ColumnModule } from '@/modules/column/column.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity]), ColumnModule],
  controllers: [BoardController],
  providers: [BoardService, BoardMapper],
  exports: [BoardService],
})
export class BoardModule {}
