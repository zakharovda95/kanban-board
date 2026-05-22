import { Module } from '@nestjs/common';

import { BoardsController } from '@/modules/boards/boards.controller';
import { BoardsService } from '@/modules/boards/boards.service';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
