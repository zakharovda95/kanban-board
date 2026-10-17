export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const key = getRouterParam(event, 'key');

  return $fetch(`${baseUrl}/v1/storage/${key}`, { method: 'GET' });
});
