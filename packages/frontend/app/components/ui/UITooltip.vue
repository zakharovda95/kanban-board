<template>
  <div ref="tooltipRef" class="flex size-auto cursor-help items-center justify-center">
    <NuxtIcon class="shrink-0" :size="computedSize.icon" name="mingcute:question-fill" :style="{ color }" />
  </div>
</template>

<script setup lang="ts">
import { type TippyOptions, useTippy } from 'vue-tippy';
import { EColor } from '@kanban-board/common';

import { EIconSize, ESize } from '~/enums/global.enums.ts';
import type { TUIComputedSizeMap } from '~/types/ui.types.ts';

const props = withDefaults(
  defineProps<{
    text: string | null | undefined;
    size?: ESize;
    color?: EColor;
    options?: TippyOptions | null;
  }>(),
  {
    size: ESize.SMALL,
    color: EColor.GREEN,
    options: null,
  },
);

const computedSize = computed(() => {
  const size: TUIComputedSizeMap = {
    small: {
      icon: EIconSize.SMALL,
    },
    medium: {
      icon: EIconSize.MEDIUM,
    },
    large: {
      icon: EIconSize.LARGE,
    },
  };

  return size[props.size];
});

const computedOptions = computed(() => {
  let options: TippyOptions = { content: props.text ?? '' };
  if (props.options) options = Object.assign(options, props.options);

  return options;
});

const tooltipRef = useTemplateRef('tooltipRef');
useTippy(tooltipRef, computedOptions.value);
</script>
