<template>
  <div class="size-full">
    <UILoader v-if="isLoading" :size="64" full />
    <div v-else class="flex size-full flex-col items-center gap-12 p-12">
      <BoardFilter />

      <div class="flex w-full flex-1 flex-row gap-8 overflow-x-auto">
        <TheColumn v-for="column in board?.columns" :key="column.id" :column="column" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TBoard } from '@kanban-board/common';

import BoardFilter from '~/components/sections/board/BoardFilter.vue';
import TheColumn from '~/components/sections/column/TheColumn.vue';
import UILoader from '~/components/ui/UILoader.vue';

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
