import { Module } from '@nestjs/common';

import AppConfigModule from '@/config/app-config.module';
import InfrastructureModule from '@/infrastructure/infrastructure.module';
import AuthModule from '@/modules/auth/auth.module';
import BoardModule from '@/modules/board/board.module';
import ColumnModule from '@/modules/column/column.module';
import IssueModule from '@/modules/issue/issue.module';
import UserModule from '@/modules/user/user.module';
import WorkspaceModule from '@/modules/workspace/workspace.module';

@Module({
  imports: [
    AppConfigModule,
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
