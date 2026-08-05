import type { TErrorResponse, TValidationErrorResponse } from '../types';

export function isValidationError(error: unknown): error is TValidationErrorResponse<unknown> {
  if (!error || typeof error !== 'object') return false;
  return Object.hasOwn(error, 'validation');
}

export function isCustomError(error: unknown): error is TErrorResponse {
  if (!error) return false;
  return Object.hasOwn(error, 'statusCode');
}

export function getErrorMessage(error: unknown): string {
  if (!error) return 'Произошла ошибка';
  if (typeof error === 'string') return error;
  if (isCustomError(error)) return `Ошибка ${error.statusCode}: ${error.message}`;
  return Object.hasOwn(error, 'message')
    ? `Ошибка: ${(error as Error).message}`
    : 'Произошла ошибка';
}
