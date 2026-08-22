<template>
  <div class="size-full">
    <UILoader v-if="isLoading" :size="64" full />
    <div v-else-if="!isLoading && !board && errorText" class="flex size-full items-center justify-center p-12">
      <p class="text-14 font-medium">{{ errorText }}</p>
    </div>
    <div v-else class="flex size-full flex-col items-center gap-12 p-12">
      <BoardFilter @add:column="emit('add:column', $event)" />

      <div class="flex h-full w-[calc(100vw-304px)] flex-1 flex-row gap-8 overflow-x-auto">
        <article
          v-for="column in board?.columns"
          :key="column.id"
          class="border-light-300 bg-light-200 rounded-12 flex size-full w-280 shrink-0 flex-col items-center gap-8 overflow-hidden border"
        >
          <header
            class="bg-light-base flex h-54 w-full shrink-0 flex-col border-b-4 px-12 py-8 text-left select-none"
            :style="{ borderBottomColor: column.color }"
          >
            <div class="flex size-full items-center justify-between">
              <ColumnInfo :column="column" class="w-[calc(100%-32px)]" />
              <ColumnActionsButtons
                :column="column"
                @update:column="emit('update:column', $event)"
                @delete:column="emit('delete:column', $event)"
              />
            </div>
          </header>

          <ColumnTopPanel :column="column" @add:issue="emit('add:issue', $event)" />

          <div class="size-full overflow-hidden">
            <div class="flex h-[calc(100vh-360px)] w-full flex-col items-center gap-8 overflow-auto px-8">
              <IssueCard
                v-for="issue in column.issues"
                :key="issue.id"
                :issue="issue"
                :color="column.color"
                @update:issue="emit('update:issue', $event)"
                @delete:issue="emit('delete:issue', $event)"
              />
            </div>
          </div>
        </article>
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
import ColumnActionsButtons from '~/components/sections/column/ColumnActionsButtons.vue';
import ColumnInfo from '~/components/sections/column/ColumnInfo.vue';
import ColumnTopPanel from '~/components/sections/column/ColumnTopPanel.vue';
import IssueCard from '~/components/sections/issue/IssueCard.vue';
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
