import { Module } from '@nestjs/common';

import DatabaseModule from '@/infrastructure/database/database.module';
import StorageModule from '@/infrastructure/storage/storage.module';

@Module({
  imports: [DatabaseModule, StorageModule],
  exports: [DatabaseModule, StorageModule],
})
export default class InfrastructureModule {}
