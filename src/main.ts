import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { DEFAULT_PORT } from '@/libs/constants/app.constants';
import { GlobalExceptionFilter } from '@/libs/filters/global-exception.filter';
import loggerMiddleware from '@/libs/middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(loggerMiddleware);

  const port = process.env.PORT || DEFAULT_PORT;
  await app.listen(port, () => console.log(`Listening on ${port}`));
}

void bootstrap();
