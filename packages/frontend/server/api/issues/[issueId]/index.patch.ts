/** Обновить задачу **/
export default defineEventHandler(async event => {
  const baseUrl = useRuntimeConfig().public?.BASE_URL ?? '';
  const issueId = getRouterParam(event, 'issueId');
  const body = await readBody(event);

  return $fetch(`${baseUrl}/v1/issues/${issueId}`, { method: 'PATCH', body });
});
