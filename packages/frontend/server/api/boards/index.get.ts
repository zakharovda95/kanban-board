import type { TBoardBase } from '@kanban-board/common';

export default defineEventHandler(async _ => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';

  return await $fetch<TBoardBase[]>(`${baseUrl}/v1/boards`, { method: 'GET' });
});
