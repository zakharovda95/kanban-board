import type { TBoard } from '@kanban-board/common';

/** Получить детальную доски **/
export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const boardId = getRouterParam(event, 'boardId');

  return $fetch<TBoard>(`${baseUrl}/v1/boards/${boardId}`, { method: 'GET' });
});
