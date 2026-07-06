<template>
  <div class="flex w-fit flex-row items-center justify-center gap-4 p-8" :class="{ 'w-full!': full }">
    <NuxtIcon class="animate-spin" name="mingcute:loading-line" :size="size" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number;
    full?: boolean;
  }>(),
  {
    size: 24,
    full: false,
  },
);
</script>
