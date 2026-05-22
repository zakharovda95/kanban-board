import { Module } from '@nestjs/common';

import { IssuesController } from '@/modules/issues/issues.controller';
import { IssuesService } from '@/modules/issues/issues.service';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService],
})
export class IssuesModule {}
