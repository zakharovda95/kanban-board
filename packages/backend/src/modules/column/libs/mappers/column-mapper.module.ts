import { Module } from '@nestjs/common';

import ColumnMapper from '@/modules/column/libs/mappers/column.mapper';
import IssueMapperModule from '@/modules/issue/libs/mappers/issue-mapper.module';

@Module({
  imports: [IssueMapperModule],
  providers: [ColumnMapper],
  exports: [ColumnMapper],
})
export default class ColumnMapperModule {}
