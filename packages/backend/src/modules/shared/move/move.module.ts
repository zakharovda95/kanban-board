import { Module } from '@nestjs/common';

import MoveService from '@/modules/shared/move/move.service';

@Module({
  providers: [MoveService],
  exports: [MoveService],
})
export default class MoveModule {}
