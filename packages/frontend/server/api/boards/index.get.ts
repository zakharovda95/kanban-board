import type { TBoardBase } from '@kanban-board/common';

export default defineEventHandler(async _ => {
  return await $fetch<TBoardBase[]>('http://localhost:3000/api/boards', { method: 'GET' });
});
