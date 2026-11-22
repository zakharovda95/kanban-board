import type { TSuccessResponse } from '@kanban-board/common';

/** Удалить пользователя. **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const userId = getRouterParam(event, 'userId');

  return await $fetch<TSuccessResponse>(`${baseUrl}/v1/users/${userId}`, {
    method: 'DELETE',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
