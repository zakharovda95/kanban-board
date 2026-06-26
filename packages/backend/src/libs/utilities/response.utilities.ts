import type { TSuccessResponse } from '@kanban-board/common';

export function getSuccessResponse(): TSuccessResponse {
  return { isSuccess: true };
}

export function getSuccessResponseWithData<TData>(data: TData): TSuccessResponse<TData> {
  return { ...getSuccessResponse(), data };
}
