import type { TAuthMeResponse } from '@kanban-board/common';

/** Получить данные о текущем пользователе **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';

  return await $fetch<TAuthMeResponse>(`${baseUrl}/v1/auth/me`, {
    method: 'GET',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
