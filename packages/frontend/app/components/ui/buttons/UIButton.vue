<template>
  <Component
    :is="tag"
    class="flex w-fit cursor-pointer flex-row flex-nowrap items-center justify-center gap-4 leading-none font-light whitespace-nowrap duration-300 outline-none hover:brightness-95"
    :class="[{ 'w-full!': full, 'disabled-element': disabled }, computedSize.element]"
    :disabled="disabled"
    :type="type"
    :style="{ backgroundColor, color }"
    @click="onClick"
  >
    <NuxtIcon v-if="prependIcon" :name="prependIcon" :size="computedSize.icon" />
    <slot />
    <NuxtIcon v-if="appendIcon" :name="appendIcon" :size="computedSize.icon" />
  </Component>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { EIconSizeSmall } from '~/enums/global.enums';
import type { TSize, TUIComputedSize, TUIComputedSizeMap } from '~/types/ui.types';

const props = withDefaults(
  defineProps<{
    tag?: 'button' | 'div' | 'span';
    size?: TSize;
    type?: 'button' | 'submit';
    prependIcon?: string | null;
    appendIcon?: string | null;
    iconSize?: EIconSizeSmall;
    disabled?: boolean;
    full?: boolean;
    backgroundColor?: EColor;
    color?: EColor;
  }>(),
  {
    tag: 'button',
    size: 'medium',
    type: 'button',
    prependIcon: null,
    appendIcon: null,
    iconSize: EIconSizeSmall.SMALL,
    disabled: false,
    full: false,
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
);

const emit = defineEmits<{ 'click:button': [event: MouseEvent] }>();

const computedSize = computed<TUIComputedSize>(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: 'h-24 py-4 px-8 text-14 rounded-4',
      icon: EIconSizeSmall.SMALL,
    },
    medium: {
      element: 'h-32 py-6 rounded-6 px-12 text-16',
      icon: EIconSizeSmall.MEDIUM,
    },
    large: {
      element: 'h-40 py-8 px-16 rounded-6 text-18',
      icon: EIconSizeSmall.LARGE,
    },
  };

  return sizes[props.size] ?? sizes.small;
});

const onClick = (event: MouseEvent): void => {
  if (props.disabled) return;
  emit('click:button', event);
};
</script>
