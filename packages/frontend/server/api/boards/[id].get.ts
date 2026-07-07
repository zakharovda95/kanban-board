import type { TBoard } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id');
  if (!id) return null;

  return $fetch<TBoard>(`http://localhost:3000/api/boards/${id}`, { method: 'GET' });
});
