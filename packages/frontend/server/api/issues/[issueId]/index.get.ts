import type { TIssue } from '@kanban-board/common';

/** Получить задачу **/
export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const issueId = getRouterParam(event, 'issueId');

  return $fetch<TIssue>(`${baseUrl}/v1/issues/${issueId}`, { method: 'GET' });
});
