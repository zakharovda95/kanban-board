import type { TSuccessResponse } from '@kanban-board/common';

/** Удалить текущего пользователя. **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';

  return await $fetch<TSuccessResponse>(`${baseUrl}/v1/users/me`, {
    method: 'DELETE',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
