import type { TSuccessResponse } from '@kanban-board/common';

/** Отозвать приглашение. **/
export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const inviteId = getRouterParam(event, 'inviteId');

  return await $fetch<TSuccessResponse>(`${baseUrl}/v1/workspaces/invites/${inviteId}`, {
    method: 'DELETE',
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
