<template>
  <NuxtLink to="/boards" class="flex w-fit items-center justify-center gap-4">
    <span class="font-medium">KANBAN BOARD</span>
    <span v-if="showVersion" class="text-12 text-green font-semibold">v.{{ runtimeConfig.public.VERSION }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ showVersion?: boolean }>(), { showVersion: false });

const runtimeConfig = useRuntimeConfig();
</script>
