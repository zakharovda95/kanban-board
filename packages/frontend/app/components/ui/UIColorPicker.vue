<template>
  <ColorPicker v-slot="{ show }" v-model="model" with-hex-input>
    <div class="flex flex-row items-center gap-8">
      <div
        class="border-light-200 border"
        :class="[computedSize.element]"
        :style="{ backgroundColor: model }"
        @click="show"
      />
      <div class="flex cursor-pointer items-center gap-4" @click="copyColor">
        <span class="font-medium underline underline-offset-5">{{ model.toUpperCase() }}</span>
        <NuxtIcon class="text-green" :name="`mingcute:copy-line`" :size="16" />
      </div>
    </div>
  </ColorPicker>
</template>

<script setup lang="ts">
import { ESize } from '~/enums/global.enums';
import type { TUIComputedSize, TUIComputedSizeMap } from '~/types/ui.types';

const model = defineModel<string>({ required: true });

const props = withDefaults(
  defineProps<{
    size?: ESize;
  }>(),
  {
    size: ESize.SMALL,
  },
);

const toast = useToast();

const computedSize = computed<TUIComputedSize>(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: 'size-24 rounded-4',
    },
    medium: {
      element: 'size-32 rounded-6',
    },
    large: {
      element: 'size-40 rounded-8',
    },
  };

  return sizes[props.size] ?? sizes.small;
});

const { copy } = useClipboard();

const copyColor = async () => {
  await copy(model.value);
  toast.success({ message: 'Скопировано!' });
};
</script>
