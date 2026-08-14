<template>
  <NuxtLink to="/boards" class="flex w-fit items-center justify-center gap-8">
    <span class="font-medium whitespace-nowrap">KANBAN BOARD</span>
    <span v-if="showVersion" class="text-12 text-green font-semibold whitespace-nowrap">
      v.{{ runtimeConfig.public.VERSION }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showVersion?: boolean;
  }>(),
  { showVersion: false },
);

const runtimeConfig = useRuntimeConfig();
</script>
