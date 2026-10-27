import type { TAuthLoginBodySchema, TSuccessResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const body = await readBody<TAuthLoginBodySchema>(event);
  return await $fetch<TSuccessResponse>(`${baseUrl}/v1/auth/login`, { method: 'POST', body });
});
