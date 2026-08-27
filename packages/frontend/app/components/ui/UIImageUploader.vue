<template>
  <button
    class="relative m-0 size-fit border-none bg-none p-0 outline-none"
    :class="{ 'absolute h-1 w-1 overflow-hidden whitespace-nowrap opacity-0': hidden }"
    type="button"
    @click="openInner"
  >
    <slot v-bind="{ open }" />

    <input
      ref="input"
      class="absolute h-1 w-1 overflow-hidden whitespace-nowrap"
      :name="name"
      type="file"
      accept="image/*"
      @change="upload"
    >
  </button>
</template>

<script setup lang="ts">
import type { IUIImageUploaderData, IUIImageUploaderFile } from '~/types/ui.types';
import { ImageUtility } from '~/utilities/image.utility';

const slots = useSlots();

withDefaults(
  defineProps<{
    name: string;
    hidden?: boolean;
  }>(),
  { hidden: false },
);

const emit = defineEmits<{
  'update:data': [value: IUIImageUploaderData];
  'update:file': [value: IUIImageUploaderFile];
}>();

const input = useTemplateRef('input');

const hasContent = computed(() => Boolean(slots.default?.()[0]?.children));

const open = (): void => {
  if (!input.value) return;
  input.value.value = '';
  input.value.click();
};

const openInner = (): void => {
  if (!hasContent.value) return;
  open();
};

const upload = async (event: Event): Promise<void> => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  const { files } = target;
  if (!files?.length) return;

  const file = files[0];
  if (!file) return;

  const src = URL.createObjectURL(file);
  const arrayBuffer = await ImageUtility.readImageAsArrayBuffer(file);
  const type = ImageUtility.getImageMimeType(arrayBuffer, file.type);

  emit('update:data', { src, type });
  emit('update:file', { file });
};

defineExpose({ open });
</script>
