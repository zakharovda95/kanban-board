import { NestFactory } from '@nestjs/core';

import AppModule from '@/app.module';
import {
  GLOBAL_API_PREFIX,
  VERSIONING_OPTIONS,
} from '@/config/libs/constants/app-config.constants';
import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import CustomValidationPipe from '@/libs/pipes/custom-validation.pipe';

async function bootstrap() {
  const host = process.env.BACKEND_HOST;
  const port = process.env.BACKEND_PORT;

  if (!host || !port) throw new Error(EXCEPTION_MESSAGES.bootstrapError);

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(CustomValidationPipe.httpValidationPipe);
  app.setGlobalPrefix(GLOBAL_API_PREFIX);
  app.enableVersioning(VERSIONING_OPTIONS);

  await app.listen(port, host, () => console.log(`Listening on ${port}`));
}

void bootstrap();
