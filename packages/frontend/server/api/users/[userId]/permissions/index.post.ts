import type { TSuccessResponse, TUpdateUserPermissionBodySchema } from '@kanban-board/common';

/** Заменить набор разрешений пользователя. **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const userId = getRouterParam(event, 'userId');
  const body: TUpdateUserPermissionBodySchema = await readBody(event);

  return await $fetch<TSuccessResponse>(`${baseUrl}/v1/users/${userId}/permissions`, {
    method: 'POST',
    body,
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
