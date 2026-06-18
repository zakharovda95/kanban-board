import type { TSuccessResponse } from '@/libs/types/response.types';

export function getSuccessResponse(): TSuccessResponse {
  return { isSuccess: true };
}

export function getSuccessResponseWithData<TData>(data: TData): TSuccessResponse<TData> {
  return { ...getSuccessResponse(), data };
}
