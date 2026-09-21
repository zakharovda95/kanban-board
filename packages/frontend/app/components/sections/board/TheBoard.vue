<template>
  <div class="flex size-full flex-col items-center gap-12 p-12">
    <BoardFilter />

    <div v-if="!board?.columns.length" class="flex size-full flex-col items-center justify-center gap-8 p-12">
      <p class="text-14 font-medium">Для начала работы необходимо добавить колонку.</p>
      <AddColumnButton />
    </div>

    <div v-else class="relative size-full">
      <BoardScrollButton
        @mouseenter="startScrollLeft"
        @mouseleave="stopScroll"
        @dragenter.prevent="startScrollLeft"
        @dragover.prevent="onDragOverLeft"
        @dragleave="stopScroll"
        @drop.prevent="stopScroll"
      />
      <OverlayScrollbarsComponent ref="boardScrollRef" class="w-[calc(100vw-304px)]" :options="scrollbarOptionsBoard">
        <div class="flex h-full flex-1 flex-row gap-12">
          <article
            v-for="column in board.columns"
            :key="column.id"
            class="border-light-200 bg-light-100 rounded-12 flex size-full w-280 shrink-0 flex-col items-center gap-8 overflow-hidden border"
          >
            <header
              class="bg-light-base flex h-54 min-h-54 w-full shrink-0 flex-col overflow-hidden border-b-4 px-12 py-8 text-left select-none"
              :style="{ borderBottomColor: column.color }"
            >
              <div class="flex size-full items-center justify-between">
                <ColumnInfo :column="column" class="w-[calc(100%-32px)]" />
                <ColumnActionsButtons :column-id="column.id" />
              </div>
            </header>

            <ColumnTopPanel :column="column" />

            <div class="size-full overflow-hidden pb-8">
              <OverlayScrollbarsComponent class="size-full h-[calc(100vh-348px)]" :options="scrollbarOptionsColumn">
                <draggable
                  v-model="column.issues"
                  class="flex min-h-full w-full flex-col items-center gap-8 px-8"
                  item-key="id"
                  group="board-issues"
                  ghost-class="drag-ghost"
                  :animation="200"
                  :disabled="isLoadingSocket"
                  @start="boardStore.takeSnapshot"
                  @change="onIssueMove($event, column)"
                >
                  <template #item="{ element: issue }">
                    <IssueCard
                      :issue="issue"
                      :color="column.color"
                      :is-loading="isLoadingIssueDetails && selectedIssueId === issue.id"
                      @open:details="issueDetailsStore.openIssueDetails"
                    />
                  </template>
                </draggable>
              </OverlayScrollbarsComponent>
            </div>
          </article>
        </div>
      </OverlayScrollbarsComponent>
      <BoardScrollButton
        position="right"
        @mouseenter="startScrollRight"
        @mouseleave="stopScroll"
        @dragenter.prevent="startScrollRight"
        @dragover.prevent="onDragOverRight"
        @dragleave="stopScroll"
        @drop.prevent="stopScroll"
      />
    </div>

    <IssueDetailsModal
      v-if="issueDetails"
      :is-open="isModalOpen"
      :issue="issueDetails"
      :stages="stages"
      @update:is-open="issueDetailsStore.onModalClose"
      @update:issue="issueDetailsStore.onUpdateIssue"
      @delete:issue="issueDetailsStore.onDeleteIssue"
      @change:stage="issueDetailsStore.onChangeStage"
    />
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import type { TColumn, TIssueBase, TMoveIssue } from '@kanban-board/common';
import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentProps,
  type OverlayScrollbarsComponentRef,
} from 'overlayscrollbars-vue';
import { storeToRefs } from 'pinia';

import { useBoardStore } from '~/stores/board.store.ts';
import { useIssueDetailsStore } from '~/stores/issue-details.store.ts';
import type { TDragChangeDetails } from '~/types/shared.types.ts';

import BoardFilter from '~/components/sections/board/BoardFilter.vue';
import BoardScrollButton from '~/components/sections/board/BoardScrollButton.vue';
import AddColumnButton from '~/components/sections/column/AddColumnButton.vue';
import ColumnActionsButtons from '~/components/sections/column/ColumnActionsButtons.vue';
import ColumnInfo from '~/components/sections/column/ColumnInfo.vue';
import ColumnTopPanel from '~/components/sections/column/ColumnTopPanel.vue';
import IssueCard from '~/components/sections/issue/IssueCard.vue';
import IssueDetailsModal from '~/components/sections/issue/IssueDetailsModal.vue';

const boardStore = useBoardStore();
const issueDetailsStore = useIssueDetailsStore();

const { board } = storeToRefs(boardStore);

const { issueDetails, isLoadingSocket, isLoadingIssueDetails, issueIdFromQuery, selectedIssueId, isModalOpen, stages } =
  storeToRefs(issueDetailsStore);

if (issueIdFromQuery.value) {
  issueDetailsStore.subscribeToIssueUpdates();
}

const onIssueMove = (details: TDragChangeDetails<TIssueBase>, column: TColumn) => {
  if (!board.value) return;

  // При переносе между колонками removed игнорируем, запрос шлём только с added/moved.
  if (details.removed || (!details.added && !details.moved)) return;

  const change = details.added ?? details.moved;
  if (!change) return;

  const { element, newIndex } = change;
  const fromColumnId = element.columnId;
  const toColumnId = column.id;

  if (details.added) element.columnId = toColumnId;

  const body: TMoveIssue = {
    boardId: board.value.id,
    targetId: element.id,
    previousId: column.issues[newIndex - 1]?.id ?? null,
    fromColumnId,
    toColumnId: fromColumnId !== toColumnId ? toColumnId : null,
  };

  issueDetailsStore.emitMove(body);
};

let RAFId: number | null = null;
let dragOverStopTimer: ReturnType<typeof setTimeout> | null = null;
const SCROLL_DELTA = 12;
const boardScrollRef = useTemplateRef<OverlayScrollbarsComponentRef | null>('boardScrollRef');

const getBoardViewport = () => boardScrollRef.value?.osInstance()?.elements().viewport ?? null;

const stopScroll = () => {
  if (dragOverStopTimer !== null) {
    clearTimeout(dragOverStopTimer);
    dragOverStopTimer = null;
  }
  if (RAFId === null) return;
  cancelAnimationFrame(RAFId);
  RAFId = null;
};

const scrollRight = () => {
  const scrollContainer = getBoardViewport();
  if (!scrollContainer) {
    RAFId = null;
    return;
  }

  const isMaxScroll = scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth;
  if (isMaxScroll) {
    RAFId = null;
    return;
  }

  scrollContainer.scrollLeft += SCROLL_DELTA;
  RAFId = requestAnimationFrame(scrollRight);
};

const scrollLeft = () => {
  const scrollContainer = getBoardViewport();
  if (!scrollContainer) {
    RAFId = null;
    return;
  }

  const isMinScroll = scrollContainer.scrollLeft <= 0;
  if (isMinScroll) {
    RAFId = null;
    return;
  }

  scrollContainer.scrollLeft -= SCROLL_DELTA;
  RAFId = requestAnimationFrame(scrollLeft);
};

const startScrollLeft = () => {
  if (RAFId !== null) return;
  scrollLeft();
};

const startScrollRight = () => {
  if (RAFId !== null) return;
  scrollRight();
};

/** dragover приходит непрерывно, пока задача наведена на кнопку. */
const keepDragScroll = (start: () => void) => {
  start();
  if (dragOverStopTimer !== null) clearTimeout(dragOverStopTimer);
  dragOverStopTimer = setTimeout(stopScroll, 120);
};

const onDragOverLeft = () => keepDragScroll(startScrollLeft);
const onDragOverRight = () => keepDragScroll(startScrollRight);

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

onBeforeUnmount(() => {
  stopScroll();
  issueDetailsStore.stopListen();
  issueDetailsStore.resetStore();
});
</script>
