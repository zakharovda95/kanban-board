import type { TAuthLoginBodySchema, TSuccessResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const body = await readBody<TAuthLoginBodySchema>(event);

  const response = await $fetch.raw<TSuccessResponse>(`${baseUrl}/v1/auth/login`, {
    method: 'POST',
    body,
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });

  // пробрасываем http-only куки сессии в браузер
  const setCookies = response.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    appendResponseHeader(event, 'set-cookie', cookie);
  }

  return response._data;
});
