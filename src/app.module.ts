import { Module } from '@nestjs/common';

import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { BoardsModule } from '@/modules/boards/boards.module';
import { ColumnsModule } from '@/modules/columns/columns.module';
import { IssuesModule } from '@/modules/issues/issues.module';

@Module({
  imports: [InfrastructureModule, BoardsModule, ColumnsModule, IssuesModule],
})
export class AppModule {}
