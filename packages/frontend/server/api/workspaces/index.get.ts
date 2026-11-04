import type { TWorkspace } from '@kanban-board/common';

/** Получить данные о текущем рабочем пространстве **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';

  return await $fetch<TWorkspace>(`${baseUrl}/v1/workspaces`, {
    method: 'GET',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
