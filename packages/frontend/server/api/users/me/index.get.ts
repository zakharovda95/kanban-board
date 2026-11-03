import type { TUser } from '@kanban-board/common';

/** Получить данные о текущем пользователе **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';

  return await $fetch<TUser | null>(`${baseUrl}/v1/users/me`, {
    method: 'GET',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
