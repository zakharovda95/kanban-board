import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import DatabaseConfig from '@/infrastructure/database/database.config';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: DatabaseConfig })],
})
export default class DatabaseModule {}
