<template>
  <button
    class="relative flex shrink-0 cursor-pointer items-center rounded-full p-2 duration-300 outline-none hover:brightness-95"
    :class="[computedTrackSize.element, { 'bg-light-300': !model, 'disabled-element': disabled }]"
    :style="{ backgroundColor: model ? color : undefined }"
    type="button"
    role="switch"
    :aria-checked="model"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="bg-light-base block rounded-full shadow-sm duration-300" :class="[computedThumbSize.element]" />
  </button>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import type { TSize, TUIComputedSize, TUIComputedSizeMap } from '~/types/ui.types';

const model = defineModel<boolean>({ required: true });

const props = withDefaults(
  defineProps<{
    size?: TSize;
    color?: EColor | string;
    disabled?: boolean;
  }>(),
  {
    size: 'medium',
    color: EColor.GREEN,
    disabled: false,
  },
);

const computedTrackSize = computed<TUIComputedSize>(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: 'h-16 w-28',
    },
    medium: {
      element: 'h-20 w-36',
    },
    large: {
      element: 'h-24 w-44',
    },
  };

  return sizes[props.size] ?? sizes.small;
});

const computedThumbSize = computed<TUIComputedSize>(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: model.value ? 'size-12 translate-x-12' : 'size-12',
    },
    medium: {
      element: model.value ? 'size-16 translate-x-16' : 'size-16',
    },
    large: {
      element: model.value ? 'size-20 translate-x-20' : 'size-20',
    },
  };

  return sizes[props.size] ?? sizes.small;
});

const toggle = (): void => {
  if (props.disabled) return;
  model.value = !model.value;
};
</script>
