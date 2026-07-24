import type { TPatchBoard, TSuccessResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const id = getRouterParam(event, 'id');
  const body: TPatchBoard = await readBody(event);

  return $fetch<TSuccessResponse>(`${baseUrl}/v1/columns/${id}`, { method: 'PATCH', body });
});
