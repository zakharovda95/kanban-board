import { Module } from '@nestjs/common';

import { BoardsController } from '@/modules/boards/boards.controller';

@Module({
  controllers: [BoardsController],
})
export class BoardsModule {}
