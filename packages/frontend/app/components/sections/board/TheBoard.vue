<template>
  <div class="size-full">
    <UILoader v-if="isLoading" :size="64" full />
    <div v-else-if="!isLoading && !board && errorText" class="flex size-full items-center justify-center p-12">
      <p class="text-14 font-medium">{{ ERROR_BOARD_TEXT }}</p>
    </div>
    <div v-else class="flex size-full flex-col items-center gap-12 p-12">
      <BoardFilter @update:columns="emit('update:columns')" />

      <div class="flex w-full flex-1 flex-row gap-8 overflow-x-auto">
        <TheColumn
          v-for="column in board?.columns"
          :key="column.id"
          :column="column"
          @update:columns="emit('update:columns')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TBoard } from '@kanban-board/common';

import { ERROR_BOARD_TEXT } from '~/constants/board.constants';

import BoardFilter from '~/components/sections/board/BoardFilter.vue';
import TheColumn from '~/components/sections/column/TheColumn.vue';
import UILoader from '~/components/ui/UILoader.vue';

withDefaults(
  defineProps<{
    board: TBoard | null;
    errorText?: string | null;
    isLoading?: boolean;
  }>(),
  {
    errorText: null,
    isLoading: false,
  },
);

const emit = defineEmits<{
  'update:columns': [];
}>();
</script>
