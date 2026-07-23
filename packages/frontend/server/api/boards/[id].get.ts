import type { TBoard } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const id = getRouterParam(event, 'id');

  return $fetch<TBoard>(`${baseUrl}/v1/boards/${id}`, { method: 'GET' });
});
