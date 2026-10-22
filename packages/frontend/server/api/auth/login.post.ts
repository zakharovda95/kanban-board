import type { TAuthData, TAuthLoginResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const body = await readBody<TAuthData>(event);
  return await $fetch<TAuthLoginResponse>(`${baseUrl}/v1/auth/login`, { method: 'POST', body });
});
