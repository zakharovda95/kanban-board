import { resolve } from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfigSchema } from '@/config/libs/app-config.schema';

const envFilePath = resolve(__dirname, '../../../..', `.env.${process.env.NODE_ENV}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath,
      validationSchema: appConfigSchema,
    }),
  ],
})
export default class AppConfigModule {}
