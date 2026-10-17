import { FILE_MAX_SIZE, type TErrorResponse } from '@kanban-board/common';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Response } from 'express';

/** Перехватчик Multer ошибок. Нужен для нормализации текста ошибки.
 *  MulterError не перехватывается потому что идет трансформация ошибки
 *  MulterError --> BadRequestException | PayloadTooLargeException на уровне FileInterceptor
 * */
@Catch(BadRequestException, PayloadTooLargeException)
export default class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: PayloadTooLargeException | BadRequestException, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const response: Response = httpContext.getResponse();

    const error: TErrorResponse = {
      message: 'Произошла ошибка при загрузке файла',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    };

    // Обработанная ошибка после кастомного пайпа.
    if (exception.getStatus() === 422) {
      const exceptionResponse = exception.getResponse();

      // Такого не должно быть, но на всякий случай.
      if (typeof exceptionResponse === 'string') {
        error.message = exceptionResponse;
        response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
        return;
      }

      response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(exceptionResponse);
      return;
    }

    // Только если явно задана в настройках File(s)Interceptor лимит по размеру файла.
    // Тогда не пройдет до пайпа, где тоже есть проверка на размер.
    if (exception instanceof PayloadTooLargeException) {
      error.message = `Размер файла не должен превышать ${FILE_MAX_SIZE / 1024}Кб.`;
    }

    if (exception instanceof BadRequestException) {
      const parts = exception.message.split('-').map(part => part.trim());

      // Если указано неверное поле
      if (parts.includes('Unexpected field')) {
        error.message = `Ожидается поле files${parts[1] ? `, указано поле ${parts[1]}` : ''}`;
      }

      // Добавить если возникнут ошибки другого типа.
    }

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
  }
}
