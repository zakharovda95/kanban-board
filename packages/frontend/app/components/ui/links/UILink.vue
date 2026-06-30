<template>
  <Component :is="tag" class="text-light-700 flex cursor-pointer flex-row flex-nowrap gap-4">
    <NuxtIcon name="mingcute:layout-7-line" :size="24" />
    <span class="text-18 font-medium underline-offset-4 duration-300 hover:underline">
      <slot />
    </span>
  </Component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: 'a' | 'NuxtLink';
    icon?: string | null;
  }>(),
  {
    tag: 'NuxtLink',
    icon: null,
  },
);
</script>
