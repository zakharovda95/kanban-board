<template>
  <label class="flex flex-col gap-2">
    <span class="text-12">
      {{ text }}
      <span v-if="required" class="text-12 text-red">*</span>
    </span>
    <slot />
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string;
    required?: boolean;
  }>(),
  {
    required: false,
  },
);
</script>
