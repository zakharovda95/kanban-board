<template>
  <div class="laptop:justify-start flex h-full min-h-0 flex-col items-stretch justify-center overflow-hidden text-left">
    <p class="text-14 block h-18 overflow-hidden leading-18 font-medium text-ellipsis whitespace-nowrap">
      {{ column.title }}
    </p>
    <p
      v-if="!hideDescription"
      class="text-12 block h-16 w-full overflow-hidden leading-16 font-light text-ellipsis whitespace-nowrap"
    >
      {{ column.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { TColumn } from '@kanban-board/common';

withDefaults(
  defineProps<{
    column: TColumn;
    hideDescription?: boolean;
  }>(),
  {
    hideDescription: false,
  },
);
</script>
