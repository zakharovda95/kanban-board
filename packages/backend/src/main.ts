import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { DEFAULT_HOST, DEFAULT_PORT } from '@/libs/constants/app-config.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalValidationPipe = new ValidationPipe({
    whitelist: true,
    transform: true,
    validateCustomDecorators: true,
  });
  app.useGlobalPipes(globalValidationPipe);

  const host = process.env.HOST || DEFAULT_HOST;
  const port = process.env.PORT || DEFAULT_PORT;
  await app.listen(port, host, () => console.log(`Listening on ${port}`));
}

void bootstrap();
