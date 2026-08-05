import { EErrorType, TValidationErrorResponse } from '@kanban-board/common';
import { HttpException, HttpStatus, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';

export class CustomValidationPipe {
  private static BASE_SETTINGS: ValidationPipeOptions = {
    whitelist: true,
    transform: true,
    validateCustomDecorators: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  };

  private static mapValidationErrors(errors: ValidationError[]): Record<string, string[]> {
    return Object.fromEntries(
      errors.map(({ property, constraints }) => [property, Object.values(constraints as object)]),
    );
  }

  public static get httpValidationPipe(): ValidationPipe {
    return new ValidationPipe({
      ...this.BASE_SETTINGS,
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrorResponse: TValidationErrorResponse<unknown> = {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: EXCEPTION_MESSAGES.validationErrors,
          validation: this.mapValidationErrors(errors),
        };

        return new HttpException(validationErrorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
      },
    });
  }

  public static get wsValidationPipe(): ValidationPipe {
    return new ValidationPipe({
      ...this.BASE_SETTINGS,
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrorResponse: TValidationErrorResponse<unknown> = {
          statusCode: EErrorType.VALIDATION,
          message: EXCEPTION_MESSAGES.validationErrors,
          validation: this.mapValidationErrors(errors),
        };

        return new WsException(validationErrorResponse);
      },
    });
  }
}
