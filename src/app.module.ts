import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { APP_CONFIG_OPTIONS } from '@/libs/constants/app-config.constants';
import { BoardsModule } from '@/modules/boards/boards.module';
import { ColumnsModule } from '@/modules/columns/columns.module';
import { IssuesModule } from '@/modules/issues/issues.module';

@Module({
  imports: [
    ConfigModule.forRoot(APP_CONFIG_OPTIONS),
    InfrastructureModule,
    BoardsModule,
    ColumnsModule,
    IssuesModule,
  ],
})
export class AppModule {}
