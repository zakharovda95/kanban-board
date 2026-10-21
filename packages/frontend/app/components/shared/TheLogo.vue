<template>
  <NuxtLink v-if="variant === 'for-header'" to="/boards" class="flex w-fit items-center justify-center gap-8">
    <span class="font-medium whitespace-nowrap">{{ text }}</span>
    <span v-if="showVersion" class="text-12 text-green font-semibold whitespace-nowrap"> v.{{ version }} </span>
  </NuxtLink>
  <div v-if="variant === 'for-page'" class="flex flex-col items-end justify-center">
    <span class="text-32 laptop:text-36 font-medium whitespace-nowrap">{{ text }}</span>
    <span v-if="showVersion" class="text-14 text-green relative -right-20 inline-block font-semibold whitespace-nowrap">
      версия {{ version }}
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showVersion?: boolean;
    variant?: 'for-header' | 'for-page';
  }>(),
  {
    showVersion: false,
    variant: 'for-header',
  },
);

const runtimeConfig = useRuntimeConfig();

const text = 'KANBAN BOARD';
const version = runtimeConfig.public.VERSION;
</script>
