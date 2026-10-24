import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';

import AppConfig from '@/config/app.config';
import InfrastructureModule from '@/infrastructure/infrastructure.module';
import AuthModule from '@/modules/auth/auth.module';
import BoardModule from '@/modules/board/board.module';
import ColumnModule from '@/modules/column/column.module';
import IssueModule from '@/modules/issue/issue.module';
import UserModule from '@/modules/user/user.module';
import WorkspaceModule from '@/modules/workspace/workspace.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot(AppConfig.appConfigOptions),
    InfrastructureModule,
    BoardModule,
    ColumnModule,
    IssueModule,
    WorkspaceModule,
    UserModule,
    AuthModule,
  ],
})
export default class AppModule {}
