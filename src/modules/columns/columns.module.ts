import { Module } from '@nestjs/common';

import { ColumnsController } from '@/modules/columns/columns.controller';

@Module({
  controllers: [ColumnsController],
})
export class ColumnsModule {}
