import type { TPatchBoard, TSuccessResponse } from '@kanban-board/common';

/** Обновить колонку **/
export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const columnId = getRouterParam(event, 'columnId');
  const body: TPatchBoard = await readBody(event);

  return $fetch<TSuccessResponse>(`${baseUrl}/v1/columns/${columnId}`, { method: 'PATCH', body });
});
