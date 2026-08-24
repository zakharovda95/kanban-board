<template>
  <div
    class="text-12 rounded-4 flex w-fit cursor-default items-center justify-center gap-4 leading-none whitespace-nowrap"
    :class="[computedSize.element]"
    :style="{ backgroundColor, color }"
    @click="emit('click:badge', $event)"
  >
    <NuxtIcon v-if="prependIcon" :name="prependIcon" :size="computedSize.icon" />
    <slot />
    <NuxtIcon v-if="appendIcon" :name="appendIcon" :size="computedSize.icon" />
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import type { TSize, TUIComputedSize, TUIComputedSizeMap } from '~/types/ui.types';

const props = withDefaults(
  defineProps<{
    size?: TSize;
    prependIcon?: string | null;
    appendIcon?: string | null;
    backgroundColor?: EColor | string;
    color?: EColor;
  }>(),
  {
    size: 'medium',
    prependIcon: null,
    appendIcon: null,
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
);

const emit = defineEmits<{ 'click:badge': [event: MouseEvent] }>();

const computedSize = computed<TUIComputedSize>(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: 'h-20 p-4 rounded-4 text-12',
      icon: 12,
    },
    medium: {
      element: 'h-24 p-4 rounded-4 text-14',
      icon: 14,
    },
    large: {
      element: 'h-32 p-6 rounded-6 text-16',
      icon: 16,
    },
  };

  return sizes[props.size] ?? sizes.small;
});
</script>
