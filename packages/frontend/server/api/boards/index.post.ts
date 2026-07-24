import type { TCreateBoard, TCreateBoardResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const body: TCreateBoard = await readBody(event);

  return await $fetch<TCreateBoardResponse>(`${baseUrl}/v1/boards`, { method: 'POST', body });
});
