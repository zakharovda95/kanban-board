import type { TPatchBoard, TSuccessResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const body: TPatchBoard = await readBody(event);
  return await $fetch<TSuccessResponse>('http://localhost:3000/api/boards', { method: 'PATCH', body });
});
