import { EErrorType, TValidationErrorResponse } from '@kanban-board/common';
import {
  HttpException,
  HttpStatus,
  StandardSchemaValidationPipe,
  ValidationPipe,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { ValidationError } from 'class-validator';

export default class CustomValidationPipe {
  private static mapValidationErrors(errors: ValidationError[]): Record<string, string[]> {
    return Object.fromEntries(
      errors.map(({ property, constraints }) => [property, Object.values(constraints as object)]),
    );
  }

  private static mapStandardSchemaIssues(
    issues: readonly StandardSchemaV1.Issue[],
  ): Record<string, string[]> {
    return issues.reduce<Record<string, string[]>>((acc, { path, message }) => {
      const property = path?.length
        ? path.map(segment => String(typeof segment === 'object' ? segment.key : segment)).join('.')
        : '';

      (acc[property] ??= []).push(message);
      return acc;
    }, {});
  }

  public static get httpStandardSchemaPipe(): StandardSchemaValidationPipe {
    return new StandardSchemaValidationPipe({
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      validateCustomDecorators: true,
      exceptionFactory: (issues): HttpException => {
        const validationErrorResponse: TValidationErrorResponse<unknown> = {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Запрос содержит некорректные данные',
          validation: CustomValidationPipe.mapStandardSchemaIssues(issues),
        };

        return new HttpException(validationErrorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
      },
    });
  }

  public static get wsStandardSchemaPipe(): StandardSchemaValidationPipe {
    return new StandardSchemaValidationPipe({
      transform: true,
      validateCustomDecorators: true,
      exceptionFactory: (issues): WsException => {
        const validationErrorResponse: TValidationErrorResponse<unknown> = {
          statusCode: EErrorType.VALIDATION,
          message: 'Запрос содержит некорректные данные',
          validation: CustomValidationPipe.mapStandardSchemaIssues(issues),
        };

        return new WsException(validationErrorResponse);
      },
    });
  }

  public static get httpValidationPipe(): ValidationPipe {
    return new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      validateCustomDecorators: true,
      exceptionFactory: (errors: ValidationError[]): HttpException => {
        const validationErrorResponse: TValidationErrorResponse<unknown> = {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Запрос содержит некорректные данные',
          validation: CustomValidationPipe.mapValidationErrors(errors),
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
      exceptionFactory: (errors: ValidationError[]): WsException => {
        const validationErrorResponse: TValidationErrorResponse<unknown> = {
          statusCode: EErrorType.VALIDATION,
          message: 'Запрос содержит некорректные данные',
          validation: CustomValidationPipe.mapValidationErrors(errors),
        };

        return new WsException(validationErrorResponse);
      },
    });
  }
}
