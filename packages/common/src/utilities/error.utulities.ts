import type { TErrorResponse, TValidationErrorResponse } from '../types';

export function isValidationError(error: unknown): error is TValidationErrorResponse<unknown> {
  if (!error || typeof error !== 'object') return false;
  return Object.hasOwn(error, 'validation');
}

export function getErrorMessage(error: unknown): string {
  if (!error) return 'Произошла ошибка';
  if (typeof error === 'string') return error;
  const typedError = error as TErrorResponse;
  return `Ошибка ${typedError.statusCode}: ${typedError.message}`;
}
