import { TValidationErrorResponse } from '@kanban-board/common';
import { HttpException, HttpStatus, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';

/**
 * Настроить и получить ValidationPipe в зависимости от контекста выполнения (HTTP или WebSocket).
 * **/
export default class CustomValidationPipe {
  private static readonly BASE_SETTINGS: ValidationPipeOptions = {
    whitelist: true,
    transform: true,
    validateCustomDecorators: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  };

  /**
   * Сформировать тело ошибки.
   * **/
  private static getValidationErrorBody(
    errors: ValidationError[],
  ): TValidationErrorResponse<unknown> {
    return {
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'Переданные данные не прошли проверку валидации',
      validation: Object.fromEntries(
        errors.map(({ property, constraints }) => [property, Object.values(constraints as object)]),
      ),
    };
  }

  /**
   * ValidationPipe для HTTP контекста выполнения (глобальный).
   * **/
  public static get httpValidationPipe(): ValidationPipe {
    return new ValidationPipe({
      ...this.BASE_SETTINGS,
      exceptionFactory: (errors: ValidationError[]) =>
        new HttpException(this.getValidationErrorBody(errors), HttpStatus.UNPROCESSABLE_ENTITY),
    });
  }

  /**
   * ValidationPipe для WebSocket контекста выполнения (переопределяет глобальный пайп на уровне gateway).
   * **/
  public static get wsValidationPipe(): ValidationPipe {
    return new ValidationPipe({
      ...this.BASE_SETTINGS,
      exceptionFactory: (errors: ValidationError[]) =>
        new WsException(this.getValidationErrorBody(errors)),
    });
  }
}
