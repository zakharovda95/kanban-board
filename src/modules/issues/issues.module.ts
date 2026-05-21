import { Module } from '@nestjs/common';

import { IssuesController } from '@/modules/issues/issues.controller';

@Module({
  controllers: [IssuesController],
})
export class IssuesModule {}
