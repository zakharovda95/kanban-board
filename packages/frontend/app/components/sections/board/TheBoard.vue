<template>
  <div class="size-full">
    <UILoader v-if="isLoading" :size="64" full />
    <div v-else-if="!isLoading && !board && errorText" class="flex size-full items-center justify-center p-12">
      <p class="text-14 font-medium">{{ errorText }}</p>
    </div>
    <div v-else class="flex size-full flex-col items-center gap-12 p-12">
      <BoardFilter @add:column="emit('add:column', $event)" />

      <OverlayScrollbarsComponent class="w-[calc(100vw-304px)]" :options="SCROLLBAR_OPTIONS_X">
        <div class="flex h-full flex-1 flex-row gap-12">
          <article
            v-for="column in board?.columns"
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
                  :column="column"
                  @update:column="emit('update:column', $event)"
                  @delete:column="emit('delete:column', $event)"
                />
              </div>
            </header>

            <ColumnTopPanel :column="column" @add:issue="emit('add:issue', $event)" />

            <div class="size-full overflow-hidden pb-8">
              <OverlayScrollbarsComponent class="size-full h-[calc(100vh-348px)]" :options="SCROLLBAR_OPTIONS_Y">
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
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';

import { SCROLLBAR_OPTIONS_X, SCROLLBAR_OPTIONS_Y } from '~/constants/ui.constants.ts';

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
