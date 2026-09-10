import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import AppModule from '@/app.module';
import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';

async function bootstrap() {
  const host = process.env.BACKEND_HOST;
  const port = process.env.BACKEND_PORT;

  if (!host || !port) throw new Error(EXCEPTION_MESSAGES.bootstrapError);

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(CustomValidationPipe.httpValidationPipe);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  await app.listen(port, host, () => console.log(`Listening on ${port}`));
}

void bootstrap();
