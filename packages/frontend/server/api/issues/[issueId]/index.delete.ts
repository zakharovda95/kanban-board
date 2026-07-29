import type { TSuccessResponse } from '@kanban-board/common';

/** Удалить задачу **/
export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const issueId = getRouterParam(event, 'issueId');

  return $fetch<TSuccessResponse>(`${baseUrl}/v1/issues/${issueId}`, { method: 'DELETE' });
});
