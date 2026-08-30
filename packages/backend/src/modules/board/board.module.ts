import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import BoardController from '@/modules/board/board.controller';
import BoardGateway from '@/modules/board/board.gateway';
import BoardService from '@/modules/board/board.service';
import BoardEntity from '@/modules/board/libs/entities/board.entity';
import BoardMapperModule from '@/modules/board/libs/mappers/board-mapper.module';
import MoveModule from '@/modules/shared/move/move.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity]), MoveModule, BoardMapperModule],
  controllers: [BoardController],
  providers: [BoardService, BoardGateway],
  exports: [BoardService],
})
export default class BoardModule {}
