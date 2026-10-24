import { EErrorType, TValidationErrorResponse } from '@kanban-board/common';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';

export default class CustomValidationPipe {
  private static mapValidationErrors(errors: ValidationError[]): Record<string, string[]> {
    return Object.fromEntries(
      errors.map(({ property, constraints }) => [property, Object.values(constraints as object)]),
    );
  }

  public static get httpValidationPipe(): ValidationPipe {
    return new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      validateCustomDecorators: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrorResponse: TValidationErrorResponse<unknown> = {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Запрос содержит некорректные данные',
          validation: this.mapValidationErrors(errors),
        };

        return new HttpException(validationErrorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
      },
    });
  }

  public static get wsValidationPipe(): ValidationPipe {
    return new ValidationPipe({
      whitelist: true,
      transform: true,
      // Только для @MessageBody: глобальный pipe с этим флагом ломает @ConnectedSocket.
      validateCustomDecorators: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrorResponse: TValidationErrorResponse<unknown> = {
          statusCode: EErrorType.VALIDATION,
          message: 'Запрос содержит некорректные данные',
          validation: this.mapValidationErrors(errors),
        };

        return new WsException(validationErrorResponse);
      },
    });
  }
}
