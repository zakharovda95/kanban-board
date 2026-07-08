<template>
  <Component
    :is="tag"
    class="flex cursor-pointer items-center justify-center leading-none duration-300 outline-none hover:brightness-95"
    :class="computedSize.element"
    @click="emit('click:button', $event)"
  >
    <NuxtIcon :name="`mingcute:${icon}`" :size="computedSize.icon" />
  </Component>
</template>

<script setup lang="ts">
import { EIconSize, ESize, ETag } from '~/enums/global.enums';
import type { TUIComputedSize, TUIComputedSizeMap } from '~/types/ui.types';

const props = withDefaults(
  defineProps<{
    tag?: ETag.BUTTON | ETag.DIV | ETag.SPAN;
    size?: ESize;
    icon: string;
    iconSize?: EIconSize;
    isLoading?: boolean;
  }>(),
  {
    tag: ETag.BUTTON,
    size: ESize.SMALL,
    iconSize: EIconSize.SMALL,
    isLoading: false,
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
</script>
