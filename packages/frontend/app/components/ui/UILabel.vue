<template>
  <!--  Всплывает click и активирует label (фокус на инпут) что иногда приводит к конфликтам (например в UIRichEditor) 
  Решение: менять label на div чтобы не делать .prevent каждый раз -->
  <Component :is="tag" class="flex flex-col gap-2">
    <span :class="textSize">
      {{ text }}
      <span v-if="required" class="text-red" :class="textSize">*</span>
    </span>
    <slot />
  </Component>
</template>

<script setup lang="ts">
import type { TSize } from '~/types/ui.types.ts';

const props = withDefaults(
  defineProps<{
    tag?: 'label' | 'div';
    text: string;
    required?: boolean;
    size?: TSize;
  }>(),
  {
    tag: 'label',
    required: false,
    size: 'medium',
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
</script>
