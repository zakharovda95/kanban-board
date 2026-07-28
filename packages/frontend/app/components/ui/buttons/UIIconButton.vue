<template>
  <Component
    :is="tag"
    class="group flex cursor-pointer items-center justify-center leading-none duration-300 outline-none hover:brightness-95"
    :style="{ backgroundColor, color }"
    :class="[computedSize.element, { 'cursor-not-allowed opacity-50': disabled }]"
    :disabled="disabled"
    :type="type"
    @click="onClick"
  >
    <NuxtIcon class="duration-300" :class="[iconClass]" :name="`mingcute:${icon}`" :size="computedSize.icon" />
  </Component>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { EIconSize, ESize, ETag } from '~/enums/global.enums';
import type { TUIComputedSize, TUIComputedSizeMap } from '~/types/ui.types';

const props = withDefaults(
  defineProps<{
    tag?: ETag.BUTTON | ETag.DIV | ETag.SPAN;
    size?: ESize;
    type?: 'button' | 'submit';
    icon: string;
    disabled?: boolean;
    backgroundColor?: EColor;
    color?: EColor;
    iconClass?: string | null;
  }>(),
  {
    tag: ETag.BUTTON,
    size: ESize.SMALL,
    type: 'button',
    disabled: false,
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
    iconClass: null,
  },
);

const emit = defineEmits<{ 'click:button': [event: MouseEvent] }>();

const computedSize = computed<TUIComputedSize>(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: 'size-24 p-4 rounded-4',
      icon: EIconSize.SMALL,
    },
    medium: {
      element: 'size-32 p-6 rounded-6',
      icon: EIconSize.MEDIUM,
    },
    large: {
      element: 'size-40 p-8 rounded-8',
      icon: EIconSize.LARGE,
    },
  };

  return sizes[props.size] ?? sizes.small;
});

const onClick = (event: MouseEvent): void => {
  if (props.disabled) return;
  emit('click:button', event);
};
</script>
