import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardsController } from '@/modules/boards/boards.controller';
import { BoardsService } from '@/modules/boards/boards.service';
import { BoardEntity } from '@/modules/boards/libs/entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity])],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
