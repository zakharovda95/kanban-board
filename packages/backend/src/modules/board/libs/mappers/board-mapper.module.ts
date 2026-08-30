import { Module } from '@nestjs/common';

import BoardMapper from '@/modules/board/libs/mappers/board.mapper';
import ColumnMapperModule from '@/modules/column/libs/mappers/column-mapper.module';

@Module({
  imports: [ColumnMapperModule],
  providers: [BoardMapper],
  exports: [BoardMapper],
})
export default class BoardMapperModule {}
