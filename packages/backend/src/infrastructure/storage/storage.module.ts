import { Module } from '@nestjs/common';

import StorageController from '@/infrastructure/storage/storage.controller';
import StorageService from '@/infrastructure/storage/storage.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export default class StorageModule {}
