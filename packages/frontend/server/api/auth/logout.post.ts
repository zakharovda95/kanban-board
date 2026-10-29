import type { TSuccessResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';

  const response = await $fetch.raw<TSuccessResponse>(`${baseUrl}/v1/auth/logout`, {
    method: 'POST',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });

  // удаляем куки из браузера
  const setCookies = response.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    appendResponseHeader(event, 'set-cookie', cookie);
  }

  return response._data;
});
