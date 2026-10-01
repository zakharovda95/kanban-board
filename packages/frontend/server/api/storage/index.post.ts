export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const body: File = await readBody(event);

  return $fetch(`${baseUrl}/v1/storage`, {
    method: 'POST',
    body,
    headers: {
      ContentType: body.type ?? 'application/octet-stream',
    },
  });
});
