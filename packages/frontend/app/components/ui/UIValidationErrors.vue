<template>
  <div class="w-fit" :class="{ 'w-full!': full }">
    <slot />

    <UIAnimatedHeight>
      <ul v-if="errors?.length" class="max-w-full">
        <li v-for="error in errors" :key="error" class="text-12 text-red text-left">· {{ error }}</li>
      </ul>
    </UIAnimatedHeight>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    errors?: string[] | null;
    full?: boolean;
  }>(),
  {
    errors: null,
    full: false,
  },
);
</script>
