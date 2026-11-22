import type { TUser } from '@kanban-board/common';

/** Получить пользователя по Id. **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const userId = getRouterParam(event, 'userId');

  return await $fetch<TUser>(`${baseUrl}/v1/users/${userId}`, {
    method: 'GET',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
