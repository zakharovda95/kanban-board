<template>
  <div
    class="bg-light-black-opacity-xl hover:bg-light-black-opacity-l absolute top-1/2 z-20 flex size-80 -translate-y-1/2 cursor-default items-center justify-center duration-300"
    :class="[position === 'left' ? 'left-0 rounded-r-full' : 'right-0 rounded-l-full']"
  >
    <NuxtIcon
      :name="position === 'left' ? 'mingcute:arrows-left-line' : 'mingcute:arrows-right-line'"
      class="text-light-black-opacity pointer-events-none size-48"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    position?: 'left' | 'right';
  }>(),
  {
    position: 'left',
  },
);
</script>
