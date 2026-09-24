import type { TBoardBase } from '@kanban-board/common';

/** Получить список досок **/
export default defineEventHandler(async _ => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.BACKEND_INTERNAL_URL || runtimeConfig.public.BASE_URL || '';

  return await $fetch<TBoardBase[]>(`${baseUrl}/v1/boards`, { method: 'GET' });
});
