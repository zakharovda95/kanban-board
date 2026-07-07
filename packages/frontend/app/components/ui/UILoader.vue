<template>
  <div class="flex w-fit flex-row items-center justify-center gap-4 p-8" :class="{ 'size-full!': full }">
    <NuxtIcon class="animate-spin" :name="`mingcute:${variant}`" :size="size" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number;
    full?: boolean;
    variant?: 'loading-3-line' | 'loading-line';
  }>(),
  {
    size: 24,
    full: false,
    variant: 'loading-line',
  },
);
</script>
