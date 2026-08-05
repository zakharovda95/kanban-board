import { TSuccessResponse } from '../types';

export function isSuccessResponse<TData = undefined>(
  response: unknown,
): response is TSuccessResponse<TData> {
  if (!response || typeof response !== 'object') return false;
  return Object.hasOwn(response, 'isSuccess') && (response as TSuccessResponse<TData>).isSuccess;
}
