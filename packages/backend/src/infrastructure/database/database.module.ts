import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import DatabaseConfigService from '@/infrastructure/database/database-config.service';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: DatabaseConfigService })],
})
export default class DatabaseModule {}
