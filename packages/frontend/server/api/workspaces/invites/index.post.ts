import type { TCreateWorkspaceInviteBodySchema, TCreateWorkspaceInviteResponse } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const body: TCreateWorkspaceInviteBodySchema = await readBody(event);

  return await $fetch<TCreateWorkspaceInviteResponse>(`${baseUrl}/v1/workspaces/invites`, {
    method: 'POST',
    body,
    headers: {
      cookie: getHeader(event, 'cookie') ?? '',
    },
  });
});
