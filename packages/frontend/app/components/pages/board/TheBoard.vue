<template>
  <div class="size-full">
    <UILoader v-if="isLoading" :size="64" full />
    <div v-else class="flex size-full flex-col items-center gap-12 p-12">
      <BoardFilter />

      <div class="flex w-full flex-1 flex-row gap-8">
        <BoardColumn v-for="column in board?.columns" :key="column.id" :column="column" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TBoard } from '@kanban-board/common';

import BoardColumn from '~/components/pages/board/BoardColumn.vue';
import BoardFilter from '~/components/pages/board/BoardFilter.vue';

withDefaults(
  defineProps<{
    board: TBoard | null;
    isLoading?: boolean;
  }>(),
  {
    isLoading: false,
  },
);
</script>
