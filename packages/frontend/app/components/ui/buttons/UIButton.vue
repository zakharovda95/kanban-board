<template>
  <Component
    :is="tag"
    class="bg-light-200 flex w-fit cursor-pointer flex-row flex-nowrap items-center justify-center gap-4 leading-none font-light whitespace-nowrap duration-300 outline-none hover:brightness-95"
    :class="[{ 'w-full!': full, 'curson-not-allowed opacity-50': disabled || isLoading }, computedSize.element]"
    @click="emit('click:button', $event)"
  >
    <NuxtIcon v-if="prependIcon" :name="`mingcute:${prependIcon}`" :size="computedSize.icon" />
    <slot />
    <NuxtIcon v-if="appendIcon" :name="`mingcute:${appendIcon}`" :size="computedSize.icon" />
  </Component>
</template>

<script setup lang="ts">
import { EIconSizeSmall, ESize, ETag } from '~/enums/global.enums';
import type { TUIComputedSize, TUIComputedSizeMap } from '~/types/ui.types';

const props = withDefaults(
  defineProps<{
    tag?: ETag.BUTTON | ETag.DIV | ETag.SPAN;
    size?: ESize;
    prependIcon?: string | null;
    appendIcon?: string | null;
    iconSize?: EIconSizeSmall;
    disabled?: boolean;
    isLoading?: boolean;
    full?: boolean;
  }>(),
  {
    tag: ETag.BUTTON,
    size: ESize.SMALL,
    prependIcon: null,
    appendIcon: null,
    iconSize: EIconSizeSmall.SMALL,
    disabled: false,
    isLoading: false,
    full: false,
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
</script>
