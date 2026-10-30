import type { TAuthRegisterBodySchema, TAuthRegisterResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const body = await readBody<TAuthRegisterBodySchema>(event);

  return await $fetch<TAuthRegisterResponse>(`${baseUrl}/v1/auth/register`, {
    method: 'POST',
    body,
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
