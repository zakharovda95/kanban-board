import type { TSuccessResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const boardId = getRouterParam(event, 'boardId');
  const columnId = getRouterParam(event, 'columnId');

  return $fetch<TSuccessResponse>(`${baseUrl}/v1/boards/${boardId}/columns/${columnId}`, { method: 'DELETE' });
});
