import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { EXCEPTION_MESSAGE } from '@/libs/constants/exceptions.constants';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const isHttpException = exception instanceof HttpException;
    const context = host.switchToHttp();

    const response = context.getResponse<Response>();

    // TODO: добавить логирование, внутренние коды ошибок приложения, обработку непредвиденных исключений.
    console.error(exception);

    if (isHttpException) {
      const status = exception.getStatus();

      response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: EXCEPTION_MESSAGE.unexpectedException,
      });
    }
  }
}
