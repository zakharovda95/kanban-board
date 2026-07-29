/** Обновить задачу **/
export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const boardId = getRouterParam(event, 'boardId');
  const columnId = getRouterParam(event, 'columnId');
  const issueId = getRouterParam(event, 'issueId');
  const body = await readBody(event);

  return $fetch(`${baseUrl}/v1/boards/${boardId}/columns/${columnId}/issues/${issueId}`, { method: 'PATCH', body });
});
