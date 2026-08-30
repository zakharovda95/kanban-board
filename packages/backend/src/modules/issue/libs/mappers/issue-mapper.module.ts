import { Module } from '@nestjs/common';

import IssueMapper from '@/modules/issue/libs/mappers/issue.mapper';

@Module({
  providers: [IssueMapper],
  exports: [IssueMapper],
})
export default class IssueMapperModule {}
