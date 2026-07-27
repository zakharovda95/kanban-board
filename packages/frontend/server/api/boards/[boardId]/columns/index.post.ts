import type { TCreateColumnResponse, TPatchBoard } from '@kanban-board/common';

/** Добавить колонку **/
export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const boardId = getRouterParam(event, 'boardId');
  const body: TPatchBoard = await readBody(event);

  return $fetch<TCreateColumnResponse>(`${baseUrl}/v1/boards/${boardId}/columns`, { method: 'POST', body });
});
