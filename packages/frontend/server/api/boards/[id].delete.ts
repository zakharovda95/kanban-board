import type { TSuccessResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const boardId = getRouterParam(event, 'id');

  return await $fetch<TSuccessResponse>(`${baseUrl}/v1/boards/${boardId}`, { method: 'DELETE' });
});
