<template>
  <div class="bg-light-300 flex h-full w-fit items-center justify-center duration-300 hover:brightness-95">
    <NuxtIcon name="mingcute:dots-fill" :size="size" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number;
  }>(),
  {
    size: 16,
  },
);
</script>
