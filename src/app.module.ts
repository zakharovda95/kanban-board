import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { APP_CONFIG_OPTIONS } from '@/libs/constants/app-config.constants';
import { BoardModule } from '@/modules/board/board.module';
import { ColumnModule } from '@/modules/column/column.module';
import { IssueModule } from '@/modules/issue/issue.module';

@Module({
  imports: [
    ConfigModule.forRoot(APP_CONFIG_OPTIONS),
    InfrastructureModule,
    BoardModule,
    ColumnModule,
    IssueModule,
  ],
})
export class AppModule {}
