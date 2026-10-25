import { EErrorType, TValidationErrorResponse } from '@kanban-board/common';
import { HttpException, HttpStatus, StandardSchemaValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import type { StandardSchemaV1 } from '@standard-schema/spec';

export default class CustomValidationPipe {
  private static isPrimitiveIssues(issues: readonly StandardSchemaV1.Issue[]): boolean {
    return issues.length > 0 && issues.every(({ path }) => !path?.length);
  }

  private static getPrimitiveMessage(issues: readonly StandardSchemaV1.Issue[]): string {
    return issues[0]?.message ?? 'Запрос содержит некорректные данные';
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
        if (this.isPrimitiveIssues(issues)) {
          return new HttpException(
            this.getPrimitiveMessage(issues),
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        const validationErrorResponse: TValidationErrorResponse<unknown> = {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Запрос содержит некорректные данные',
          validation: this.mapStandardSchemaIssues(issues),
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
        if (this.isPrimitiveIssues(issues)) {
          return new WsException(this.getPrimitiveMessage(issues));
        }

        const validationErrorResponse: TValidationErrorResponse<unknown> = {
          statusCode: EErrorType.VALIDATION,
          message: 'Запрос содержит некорректные данные',
          validation: this.mapStandardSchemaIssues(issues),
        };

        return new WsException(validationErrorResponse);
      },
    });
  }
}
