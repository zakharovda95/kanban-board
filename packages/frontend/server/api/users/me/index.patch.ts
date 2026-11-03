import type { TUpdateUserBodySchema, TUpdateUserResponse } from '@kanban-board/common';

/** Обновить данные о текущем пользователе **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const body: TUpdateUserBodySchema = await readBody(event);

  return await $fetch<TUpdateUserResponse>(`${baseUrl}/v1/users/me`, {
    method: 'PATCH',
    body,
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
