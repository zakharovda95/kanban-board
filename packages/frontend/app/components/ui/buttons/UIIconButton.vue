<template>
  <Component
    :is="tag"
    class="bg-light-300 rounded-4 flex w-fit cursor-pointer items-center justify-center p-4 duration-300 outline-none hover:brightness-95"
    @click="emit('click:button', $event)"
  >
    <NuxtIcon :name="`mingcute:${icon}`" :size="iconSize" />
  </Component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: 'button' | 'div' | 'span';
    icon: string;
    iconSize?: number;
    isLoading?: boolean;
  }>(),
  {
    tag: 'button',
    iconSize: 16,
    isLoading: false,
  },
);

const emit = defineEmits<{ 'click:button': [event: MouseEvent] }>();
</script>
