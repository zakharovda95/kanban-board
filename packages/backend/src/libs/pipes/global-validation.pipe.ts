import type { TValidationErrorResponse } from '@kanban-board/common';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';

export const globalValidationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  validateCustomDecorators: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const validationErrorResponse: TValidationErrorResponse<unknown> = {
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: EXCEPTION_MESSAGES.validationErrors,
      validation: Object.fromEntries(
        errors.map(({ property, constraints }) => [property, Object.values(constraints as object)]),
      ),
    };

    return new HttpException(validationErrorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
  },
});
