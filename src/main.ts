import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { DEFAULT_PORT } from '@/libs/constants/app.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || DEFAULT_PORT;
  await app.listen(port, () => console.log(`Listening on ${port}`));
}

void bootstrap();
