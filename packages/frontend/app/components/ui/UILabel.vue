<template>
  <!--  Всплывает click и активирует label (фокус на инпут) что иногда приводит к конфликтам (например в UIRichEditor) 
  Решение: менять label на div чтобы не делать .prevent каждый раз -->
  <Component :is="tag" class="flex flex-col gap-2">
    <span class="text-12">
      {{ text }}
      <span v-if="required" class="text-12 text-red">*</span>
    </span>
    <slot />
  </Component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: 'label' | 'div';
    text: string;
    required?: boolean;
  }>(),
  {
    tag: 'label',
    required: false,
  },
);
</script>
