import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import AppModule from '@/app.module';
import { TAppConfigSchema } from '@/config/app-config.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<TAppConfigSchema, true>);
  const host = configService.get('BACKEND_HOST', { infer: true });
  const port = configService.get('BACKEND_PORT', { infer: true });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  await app.listen(port, host, () => console.log(`Listening on ${port}`));
}

void bootstrap();
