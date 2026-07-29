import type { TSuccessResponse } from '@kanban-board/common';

/** Удалить колонку **/
export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const columnId = getRouterParam(event, 'columnId');

  return $fetch<TSuccessResponse>(`${baseUrl}/v1/columns/${columnId}`, { method: 'DELETE' });
});
