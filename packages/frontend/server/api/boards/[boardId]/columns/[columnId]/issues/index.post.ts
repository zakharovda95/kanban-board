import type { TPatchBoard } from '@kanban-board/common';

/** Добавить задачу **/
export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const boardId = getRouterParam(event, 'boardId');
  const columnId = getRouterParam(event, 'columnId');
  const body: TPatchBoard = await readBody(event);

  return await $fetch(`${baseUrl}/v1/boards/${boardId}/columns/${columnId}/issues`, { method: 'POST', body });
});
