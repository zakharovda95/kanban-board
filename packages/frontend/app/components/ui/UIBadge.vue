<template>
  <div
    class="text-12 rounded-4 flex w-fit items-center justify-center gap-4 leading-none"
    :class="[computedSize.element]"
    :style="{ backgroundColor, color }"
    @click="emit('click:badge', $event)"
  >
    <NuxtIcon v-if="prependIcon" :name="`mingcute:${prependIcon}`" :size="computedSize.icon" />
    <slot />
    <NuxtIcon v-if="appendIcon" :name="`mingcute:${appendIcon}`" :size="computedSize.icon" />
  </div>
</template>

<script setup lang="ts">
import { EColor, EIconSizeSmall, ESize } from '~/enums/global.enums';
import type { TUIComputedSize, TUIComputedSizeMap } from '~/types/ui.types';

const props = withDefaults(
  defineProps<{
    size?: ESize;
    prependIcon?: string | null;
    appendIcon?: string | null;
    backgroundColor?: EColor;
    color?: EColor;
  }>(),
  {
    size: ESize.SMALL,
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
      element: 'h-24 p-4 rounded-4 text-14',
      icon: EIconSizeSmall.SMALL,
    },
    medium: {
      element: 'h-32 p-6 rounded-6 text-16',
      icon: EIconSizeSmall.MEDIUM,
    },
    large: {
      element: 'h-40 p-8 rounded-8 text-18',
      icon: EIconSizeSmall.LARGE,
    },
  };

  return sizes[props.size] ?? sizes.small;
});
</script>
