import { Module } from '@nestjs/common';

import DatabaseModule from '@/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  exports: [DatabaseModule],
})
export default class InfrastructureModule {}
