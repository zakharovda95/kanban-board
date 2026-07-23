import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import {
  DEFAULT_HOST,
  DEFAULT_PORT,
  GLOBAL_API_PREFIX,
} from '@/config/libs/constants/app-config.constants';
import { globalValidationPipe } from '@/libs/pipes/global-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(globalValidationPipe);
  app.setGlobalPrefix(GLOBAL_API_PREFIX);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  const host = process.env.BACK_HOST || DEFAULT_HOST;
  const port = process.env.BACK_PORT || DEFAULT_PORT;
  await app.listen(port, host, () => console.log(`Listening on ${port}`));
}

void bootstrap();
