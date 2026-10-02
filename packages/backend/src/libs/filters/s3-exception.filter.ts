import { TErrorResponse } from '@kanban-board/common';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { S3Error } from 'minio';

/** Перехватывает S3 ошибки (в данном случае MinIO).
 *  Необходим для нормализации текста ошибки.
 * **/
@Catch(S3Error)
export default class S3ExceptionFilter implements ExceptionFilter {
  catch(exception: S3Error, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const response: Response = httpContext.getResponse();

    const error: TErrorResponse = {
      message: 'Произошла ошибка при работе с объектным хранилищем',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (exception.code === 'NoSuchKey') {
      error.message = 'Не верно указан ключ';
      error.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    }

    if (exception.code === 'NotFound') {
      error.message = 'Не найдено';
      error.statusCode = HttpStatus.NOT_FOUND;
    }

    response.status(Number(error.statusCode)).json(error);
  }
}
