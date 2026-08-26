<template>
  <div class="laptop:justify-start flex h-full flex-col items-stretch justify-center text-left">
    <p class="text-14 block overflow-hidden leading-18 font-medium text-ellipsis whitespace-nowrap">
      {{ column.title }}
    </p>
    <p
      v-if="column.description"
      class="text-12 block w-full overflow-hidden leading-16 font-light text-ellipsis whitespace-nowrap"
    >
      {{ column.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { TColumn } from '@kanban-board/common';

defineProps<{
  column: TColumn;
}>();
</script>
