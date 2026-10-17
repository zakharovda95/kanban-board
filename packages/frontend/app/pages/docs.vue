<template>
  <div class="flex size-full flex-col items-center justify-center gap-16 p-24">
    <span class="text-16 font-medium">Страница в разработке</span>

    <div class="flex w-full max-w-md flex-col gap-12">
      <label class="text-14 font-medium" for="minio-file-input">Тест загрузки в MinIO</label>
      <input id="minio-file-input" type="file" accept="image/*" :disabled="isUploading" @change="onFileChange" >

      <p v-if="isUploading" class="text-14 text-gray-500">Загрузка...</p>
      <p v-if="errorMessage" class="text-14 text-red-600">{{ errorMessage }}</p>

      <template v-if="uploadedUrl">
        <a
          class="text-14 break-all text-blue-600 underline"
          :href="uploadedUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ uploadedUrl }}
        </a>
        <img class="max-h-64 w-full object-contain" :src="uploadedUrl" alt="Uploaded to MinIO" >
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useMinioUpload } from '~/composables/use-minio-upload.composable';

const { uploadFile } = useMinioUpload();

const isUploading = ref(false);
const errorMessage = ref('');
const uploadedUrl = ref('');

const onFileChange = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  isUploading.value = true;
  errorMessage.value = '';
  uploadedUrl.value = '';

  try {
    const result = await uploadFile(file);
    uploadedUrl.value = result.url;
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось загрузить файл';
  } finally {
    isUploading.value = false;
    input.value = '';
  }
};
</script>
