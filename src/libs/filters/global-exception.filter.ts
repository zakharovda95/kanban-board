import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(_exception: unknown, _host: ArgumentsHost) {
    // TODO: реализовать глобальный фильтр.
  }
}
