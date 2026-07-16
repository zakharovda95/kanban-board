import type { TCreateBoard, TSuccessResponse } from '@kanban-board/common';
export default defineEventHandler(async event => {
  const body: TCreateBoard = await readBody(event);
  return await $fetch<TSuccessResponse>('http://localhost:3000/api/boards', {
    method: 'POST',
    body,
  });
});
