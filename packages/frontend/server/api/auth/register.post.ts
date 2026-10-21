import type { TAuthRegister, TAuthRegisterResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const body = await readBody<TAuthRegister>(event);
  return await $fetch<TAuthRegisterResponse>(`${baseUrl}/v1/auth/register`, { method: 'POST', body });
});
