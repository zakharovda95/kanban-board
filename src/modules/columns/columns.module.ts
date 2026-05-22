import { Module } from '@nestjs/common';

import { ColumnsController } from '@/modules/columns/columns.controller';
import { ColumnsService } from '@/modules/columns/columns.service';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
