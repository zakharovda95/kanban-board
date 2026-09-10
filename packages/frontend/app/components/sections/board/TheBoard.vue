<template>
  <div class="flex size-full flex-col items-center gap-12 p-12">
    <BoardFilter @add:column="emit('add:column', $event)" />

    <div v-if="!board.columns.length" class="flex size-full flex-col items-center justify-center gap-8 p-12">
      <p class="text-14 font-medium">Для начала работы необходимо добавить колонку.</p>
      <AddColumnButton @add:column="emit('add:column', $event)" />
    </div>
    <OverlayScrollbarsComponent v-else class="w-[calc(100vw-304px)]" :options="scrollbarOptionsBoard">
      <div class="flex h-full flex-1 flex-row gap-12">
        <article
          v-for="column in board.columns"
          :key="column.id"
          class="border-light-200 bg-light-100 rounded-12 flex size-full w-280 shrink-0 flex-col items-center gap-8 overflow-hidden border"
        >
          <header
            class="bg-light-base flex h-54 w-full flex-col border-b-4 px-12 py-8 text-left select-none"
            :style="{ borderBottomColor: column.color }"
          >
            <div class="flex size-full items-center justify-between">
              <ColumnInfo :column="column" class="w-[calc(100%-32px)]" />
              <ColumnActionsButtons
                :column-id="column.id"
                :columns="board.columns"
                @update:column="emit('update:column', $event)"
                @delete:column="emit('delete:column', $event)"
                @move:column="emit('move:column', $event)"
              />
            </div>
          </header>

          <ColumnTopPanel :column="column" @add:issue="emit('add:issue', $event)" />

          <div class="size-full overflow-hidden pb-8">
            <OverlayScrollbarsComponent class="size-full h-[calc(100vh-348px)]" :options="scrollbarOptionsColumn">
              <div class="flex w-full flex-col items-center gap-8 px-8">
                <IssueCard
                  v-for="issue in column.issues"
                  :key="issue.id"
                  :issue="issue"
                  :color="column.color"
                  @update:issue="emit('update:issue', $event)"
                  @delete:issue="emit('delete:issue', $event)"
                />
              </div>
            </OverlayScrollbarsComponent>
          </div>
        </article>
      </div>
    </OverlayScrollbarsComponent>
  </div>
</template>

<script setup lang="ts">
import type {
  TBoard,
  TColumn,
  TColumnBase,
  TDeleteColumnEmitPayload,
  TDeleteIssueEmitPayload,
  TIssueBase,
  TMoveColumnEmitPayload,
} from '@kanban-board/common';
import { OverlayScrollbarsComponent, type OverlayScrollbarsComponentProps } from 'overlayscrollbars-vue';

import BoardFilter from '~/components/sections/board/BoardFilter.vue';
import AddColumnButton from '~/components/sections/column/AddColumnButton.vue';
import ColumnActionsButtons from '~/components/sections/column/ColumnActionsButtons.vue';
import ColumnInfo from '~/components/sections/column/ColumnInfo.vue';
import ColumnTopPanel from '~/components/sections/column/ColumnTopPanel.vue';
import IssueCard from '~/components/sections/issue/IssueCard.vue';

defineProps<{ board: TBoard }>();

const emit = defineEmits<{
  'add:column': [payload: TColumn];
  'update:column': [payload: TColumnBase];
  'delete:column': [payload: TDeleteColumnEmitPayload];
  'move:column': [payload: TMoveColumnEmitPayload];
  'add:issue': [payload: TIssueBase];
  'update:issue': [payload: TIssueBase];
  'delete:issue': [payload: TDeleteIssueEmitPayload];
}>();

const scrollbarOptionsBoard: OverlayScrollbarsComponentProps['options'] = {
  overflow: { y: 'hidden' },
  scrollbars: {
    autoHide: 'leave',
    autoHideDelay: 500,
    theme: 'os-theme-board',
  },
};

const scrollbarOptionsColumn: OverlayScrollbarsComponentProps['options'] = {
  overflow: { x: 'hidden' },
  scrollbars: {
    autoHide: 'leave',
    autoHideDelay: 300,
    theme: 'os-theme-column',
  },
};
</script>
