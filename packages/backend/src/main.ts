import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import {
  DEFAULT_HOST,
  DEFAULT_PORT,
  GLOBAL_API_PREFIX,
  VERSIONING_OPTIONS,
} from '@/config/libs/constants/app-config.constants';
import { globalValidationPipe } from '@/libs/pipes/global-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(globalValidationPipe);
  app.setGlobalPrefix(GLOBAL_API_PREFIX);
  app.enableVersioning(VERSIONING_OPTIONS);

  const host = process.env.BACK_HOST || DEFAULT_HOST;
  const port = process.env.BACK_PORT || DEFAULT_PORT;
  await app.listen(port, host, () => console.log(`Listening on ${port}`));
}

void bootstrap();
