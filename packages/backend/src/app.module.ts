import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfig } from '@/config/app.config';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { BoardModule } from '@/modules/board/board.module';
import { ColumnModule } from '@/modules/column/column.module';
import { IssueModule } from '@/modules/issue/issue.module';

@Module({
  imports: [
    ConfigModule.forRoot(AppConfig.appConfigOptions),
    InfrastructureModule,
    BoardModule,
    ColumnModule,
    IssueModule,
  ],
})
export class AppModule {}
