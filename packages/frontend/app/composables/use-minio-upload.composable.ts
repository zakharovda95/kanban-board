export type TMinioUploadResult = {
  key: string;
  url: string;
};

export function useMinioUpload() {
  const runtimeConfig = useRuntimeConfig();

  const getObjectUrl = (key: string): string => {
    const publicUrl = String(runtimeConfig.public.MINIO_PUBLIC_URL).replace(/\/$/, '');
    const bucket = String(runtimeConfig.public.MINIO_BUCKET);

    return `${publicUrl}/${bucket}/${key}`;
  };

  const buildObjectKey = (file: File): string => {
    const safeName = file.name.replace(/[^\w.-]+/g, '_');
    return `uploads/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  };

  const uploadFile = async (file: File): Promise<TMinioUploadResult> => {
    const key = buildObjectKey(file);
    const url = getObjectUrl(key);

    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`MinIO upload failed: ${response.status} ${response.statusText}`);
    }

    return { key, url };
  };

  return { uploadFile, getObjectUrl };
}
