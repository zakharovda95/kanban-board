import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import {
  DEFAULT_HOST,
  DEFAULT_PORT,
  GLOBAL_API_PREFIX,
} from '@/config/libs/constants/app-config.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalValidationPipe = new ValidationPipe({
    whitelist: true,
    transform: true,
    validateCustomDecorators: true,
  });
  app.useGlobalPipes(globalValidationPipe);
  app.setGlobalPrefix(GLOBAL_API_PREFIX);

  const host = process.env.BACK_HOST || DEFAULT_HOST;
  const port = process.env.BACK_PORT || DEFAULT_PORT;
  await app.listen(port, host, () => console.log(`Listening on ${port}`));
}

void bootstrap();
