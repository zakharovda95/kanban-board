import { FILE_CONTENT_TYPE } from '@kanban-board/common';

export default defineEventHandler(async event => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.BASE_URL || '';
  const submodule = getRouterParam(event, 'submodule');
  const body: File = await readBody(event);

  return $fetch(`${baseUrl}/v1/storage/${submodule}`, {
    method: 'POST',
    body,
    headers: {
      ContentType: body.type ?? FILE_CONTENT_TYPE,
    },
  });
});
