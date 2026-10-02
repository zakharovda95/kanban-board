export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const submodule = getRouterParam(event, 'submodule');
  const fileName = getRouterParam(event, 'fileName');

  return $fetch(`${baseUrl}/v1/storage/${submodule}/${fileName}`, { method: 'GET' });
});
