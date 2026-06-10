import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardsController } from '@/modules/boards/boards.controller';
import { BoardsMapper } from '@/modules/boards/boards.mapper';
import { BoardsService } from '@/modules/boards/boards.service';
import { BoardEntity } from '@/modules/boards/libs/entities/board.entity';
import { MoveBoardPipe } from '@/modules/boards/libs/pipes/move-board.pipe';
import { ColumnsModule } from '@/modules/columns/columns.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity]), ColumnsModule],
  controllers: [BoardsController],
  providers: [BoardsService, BoardsMapper, MoveBoardPipe],
  exports: [BoardsService],
})
export class BoardsModule {}
