import type { TPermissions } from '@kanban-board/common';

/** Получить набор разрешений текущего пользователя. **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';

  return await $fetch<TPermissions>(`${baseUrl}/v1/users/me/permissions`, {
    method: 'GET',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
