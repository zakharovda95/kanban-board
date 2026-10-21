<template>
  <div class="flex flex-row flex-nowrap items-center justify-start gap-8">
    <NuxtIcon
      class="shrink-0"
      :name="icon!"
      :style="{ width: computedSize.icon, height: computedSize.icon, color: iconColor }"
    />
    <p class="font-medium" :class="computedSize.element">
      <slot />
    </p>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { EIconSizeLarge } from '~/enums/global.enums.ts';
import type { TSize, TUIComputedSize, TUIComputedSizeMap } from '~/types/ui.types.ts';

const props = withDefaults(
  defineProps<{
    icon?: string;
    size?: TSize;
    iconColor?: EColor;
  }>(),
  {
    icon: 'mingcute:alert-diamond-line',
    size: 'medium',
    iconColor: EColor.ORANGE,
  },
);

const computedSize = computed<TUIComputedSize>(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: 'text-12',
      icon: EIconSizeLarge.SMALL,
    },
    medium: {
      element: 'text-14',
      icon: EIconSizeLarge.MEDIUM,
    },
    large: {
      element: 'text-16',
      icon: EIconSizeLarge.LARGE,
    },
  };

  return sizes[props.size] ?? sizes.medium;
});
</script>
