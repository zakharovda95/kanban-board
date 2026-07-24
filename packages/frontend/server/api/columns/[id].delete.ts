import type { TSuccessResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const id = getRouterParam(event, 'id');

  return $fetch<TSuccessResponse>(`${baseUrl}/v1/columns/${id}`, { method: 'DELETE' });
});
