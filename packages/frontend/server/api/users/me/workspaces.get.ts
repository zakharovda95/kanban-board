import type { TUserWorkspace } from '@kanban-board/common';

/** Получить данные о рабочем пространстве пользователя. **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';

  return await $fetch<TUserWorkspace | null>(`${baseUrl}/v1/users/me/workspaces`, {
    method: 'GET',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
