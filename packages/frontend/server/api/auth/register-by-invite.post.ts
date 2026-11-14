import type { TAuthRegisterByInviteBodySchema, TAuthRegisterResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const body = await readBody<TAuthRegisterByInviteBodySchema>(event);

  return await $fetch<TAuthRegisterResponse>(`${baseUrl}/v1/auth/register-by-invite`, {
    method: 'POST',
    body,
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
