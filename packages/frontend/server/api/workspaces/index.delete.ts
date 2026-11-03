import type { TSuccessResponse } from '@kanban-board/common';

/** Удалить рабочее пространство. **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';

  return await $fetch<TSuccessResponse>(`${baseUrl}/v1/workspaces`, {
    method: 'DELETE',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
