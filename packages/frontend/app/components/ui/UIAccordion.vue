<template>
  <div ref="accordionRef" class="w-full">
    <div class="flex w-full flex-col" :class="[computedSize.element]" :style="{ backgroundColor }">
      <div
        class="flex w-full items-center justify-between"
        :class="[computedHeader.element, disabled ? 'disabled-element' : 'cursor-pointer']"
        @click="toggle"
      >
        <div class="min-w-0 flex-1">
          <slot name="header" :is-open="isOpen">
            <p v-if="title" class="font-medium">{{ title }}</p>
          </slot>
        </div>
        <div class="shrink-0">
          <NuxtIcon
            class="text-green duration-300"
            :class="isOpen ? 'rotate-270' : 'rotate-90'"
            name="mingcute:right-line"
            :size="computedHeader.icon"
          />
        </div>
      </div>
      <UIAnimatedHeight>
        <div v-if="isOpen" class="w-full">
          <div class="flex w-full flex-col" :class="[computedBody.element, bodyClass]">
            <slot :is-open="isOpen" :set-open="setOpen" />
          </div>
        </div>
      </UIAnimatedHeight>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { EIconSize } from '~/enums/global.enums';
import type { TSize, TUIComputedSize, TUIComputedSizeMap } from '~/types/ui.types';

import UIAnimatedHeight from '~/components/ui/UIAnimatedHeight.vue';

const props = withDefaults(
  defineProps<{
    title?: string | null;
    size?: TSize;
    defaultOpen?: boolean;
    disabled?: boolean;
    closeOnClickOutside?: boolean;
    bodyClass?: string | null;
    backgroundColor?: EColor;
  }>(),
  {
    title: null,
    size: 'medium',
    defaultOpen: false,
    disabled: false,
    closeOnClickOutside: false,
    bodyClass: null,
    backgroundColor: EColor.LIGHT_BASE,
  },
);

const emit = defineEmits<{
  toggle: [isOpen: boolean];
}>();

const isOpen = ref<boolean>(props.defaultOpen);

const computedSize = computed<TUIComputedSize>(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: 'rounded-4',
    },
    medium: {
      element: 'rounded-6',
    },
    large: {
      element: 'rounded-6',
    },
  };

  return sizes[props.size] ?? sizes.small;
});

const computedHeader = computed<TUIComputedSize>(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: 'gap-8 py-4 px-8 text-12 rounded-4',
      icon: EIconSize.SMALL,
    },
    medium: {
      element: 'gap-12 py-6 rounded-6 px-12 text-14',
      icon: EIconSize.MEDIUM,
    },
    large: {
      element: 'gap-16 py-8 px-16 rounded-6 text-16',
      icon: EIconSize.LARGE,
    },
  };

  return sizes[props.size] ?? sizes.small;
});

const computedBody = computed<TUIComputedSize>(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: 'px-8 pb-8 text-12',
    },
    medium: {
      element: 'px-12 pb-12 text-14',
    },
    large: {
      element: 'px-16 pb-16 text-16',
    },
  };

  return sizes[props.size] ?? sizes.small;
});

const setOpen = (value: boolean): void => {
  if (isOpen.value === value) return;
  isOpen.value = value;
  emit('toggle', value);
};

const toggle = (): void => {
  if (props.disabled) return;
  setOpen(!isOpen.value);
};

const accordionRef = useTemplateRef<HTMLDivElement | null>('accordionRef');

onClickOutside(accordionRef, () => {
  if (!props.closeOnClickOutside) return;
  setOpen(false);
});

defineExpose({
  isOpen: readonly(isOpen),
  setOpen,
  toggle,
});
</script>
