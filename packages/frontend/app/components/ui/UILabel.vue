<template>
  <label class="flex flex-col gap-2">
    <span class="text-12">{{ text }}</span>
    <slot />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>
