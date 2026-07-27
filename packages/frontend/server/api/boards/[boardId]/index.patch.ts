import type { TPatchBoard, TSuccessResponse } from '@kanban-board/common';

/** Обновить доску **/
export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const body: TPatchBoard = await readBody(event);
  const boardId = getRouterParam(event, 'boardId');

  return await $fetch<TSuccessResponse>(`${baseUrl}/v1/boards/${boardId}`, { method: 'PATCH', body });
});
