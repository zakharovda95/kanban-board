import type { TIssue } from '@kanban-board/common';

/** Получить задачу **/
export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const boardId = getRouterParam(event, 'boardId');
  const columnId = getRouterParam(event, 'columnId');
  const issueId = getRouterParam(event, 'issueId');

  return $fetch<TIssue>(`${baseUrl}/v1/boards/${boardId}/columns/${columnId}/issues/${issueId}`, { method: 'GET' });
});
