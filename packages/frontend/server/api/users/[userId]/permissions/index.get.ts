import type { TPermissions } from '@kanban-board/common';

/** Получить набор разрешений пользователя по Id. **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const userId = getRouterParam(event, 'userId');

  return await $fetch<TPermissions>(`${baseUrl}/v1/users/${userId}/permissions`, {
    method: 'GET',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
