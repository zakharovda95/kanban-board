<template>
  <div class="size-full">
    <UILoader v-if="isLoading" :size="64" full />
    <div v-else-if="!isLoading && !board && errorText" class="flex size-full items-center justify-center p-12">
      <p class="text-14 font-medium">{{ errorText }}</p>
    </div>
    <div v-else class="flex size-full flex-col items-center gap-12 p-12">
      <BoardFilter @add:column="emit('add:column', $event)" />

      <div class="flex h-full w-[calc(100vw-304px)] flex-1 flex-row gap-8 overflow-x-auto">
        <TheColumn
          v-for="column in board?.columns"
          :key="column.id"
          :column="column"
          @update:column="emit('update:column', $event)"
          @delete:column="emit('delete:column', $event)"
          @add:issue="emit('add:issue', $event)"
          @update:issue="emit('update:issue', $event)"
          @delete:issue="emit('delete:issue', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  TBoard,
  TColumn,
  TDeleteColumnEmitPayload,
  TDeleteIssueEmitPayload,
  TIssueBase,
} from '@kanban-board/common';

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
  'add:column': [payload: TColumn];
  'update:column': [payload: TColumn];
  'delete:column': [payload: TDeleteColumnEmitPayload];
  'add:issue': [payload: TIssueBase];
  'update:issue': [payload: TIssueBase];
  'delete:issue': [payload: TDeleteIssueEmitPayload];
}>();
</script>
