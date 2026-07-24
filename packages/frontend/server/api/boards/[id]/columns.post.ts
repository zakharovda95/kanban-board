import type { TCreateColumnResponse, TPatchBoard } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const id = getRouterParam(event, 'id');
  const body: TPatchBoard = await readBody(event);

  return $fetch<TCreateColumnResponse>(`${baseUrl}/v1/boards/${id}/columns`, { method: 'POST', body });
});
