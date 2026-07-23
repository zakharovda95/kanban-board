import type { TErrorResponse } from '@kanban-board/common';

export function isValidationError(error: unknown): boolean {
  return Object.hasOwn(error as object, 'validation');
}

export function getErrorMessage(error: unknown): string {
  const typedError = error as TErrorResponse;
  return `Ошибка ${typedError.statusCode}: ${typedError.message}`;
}
