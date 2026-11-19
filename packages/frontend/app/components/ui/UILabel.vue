<template>
  <!--  Всплывает click и активирует label (фокус на инпут) что иногда приводит к конфликтам (например в UIRichEditor) 
  Решение: менять label на div чтобы не делать .prevent каждый раз -->
  <Component :is="tag" class="flex" :class="[directionClass, positionClass]">
    <span :class="textSize">
      {{ text }}
      <span v-if="required" class="text-red" :class="textSize">*</span>
    </span>
    <slot />
  </Component>
</template>

<script setup lang="ts">
import type { TSize, TUILabelDirection, TUILabelPosition } from '~/types/ui.types.ts';

const props = withDefaults(
  defineProps<{
    tag?: 'label' | 'div';
    text: string;
    required?: boolean;
    size?: TSize;
    direction?: TUILabelDirection;
    position?: TUILabelPosition;
  }>(),
  {
    tag: 'label',
    required: false,
    size: 'medium',
    direction: 'column',
    position: 'start',
  },
);

const textSize = computed(() => {
  switch (props.size) {
    case 'small':
      return 'text-10';
    case 'medium':
      return 'text-12';
    case 'large':
      return 'text-14';
    default:
      return 'text-12';
  }
});

const directionClass = computed(() => {
  switch (props.direction) {
    case 'row':
      return 'flex-row items-center gap-8';
    case 'column':
      return 'flex-col gap-2';
    default:
      return 'flex-col gap-2';
  }
});

const positionClass = computed(() => {
  switch (props.position) {
    case 'start':
      return 'justify-start';
    case 'end':
      return 'justify-end';
    case 'between':
      return 'justify-between';
    default:
      return 'justify-start';
  }
});
</script>
