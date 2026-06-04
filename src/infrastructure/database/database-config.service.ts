import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ENodeEnv } from '@/libs/enums/app.enums';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {
    console.log(123123);
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const nodeEnv = this.configService.get<ENodeEnv>('NODE_ENV');

    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      database: this.configService.get<string>('DB_NAME'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      poolSize: this.configService.get<number>('DB_POOL_SIZE'),
      synchronize: nodeEnv !== ENodeEnv.PRODUCTION,
      autoLoadEntities: true,
      entityPrefix: undefined,
      // dropSchema: true,
    };
  }
}
