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
              <draggable
                v-model="column.issues"
                class="flex min-h-full w-full flex-col items-center gap-8 px-8"
                item-key="id"
                group="board-issues"
                ghost-class="drag-ghost"
                :animation="200"
                :disabled="isLoading"
                @start="emit('take:snapshot')"
                @change="onIssueChange($event, column)"
              >
                <template #item="{ element: issue }">
                  <IssueCard
                    :issue="issue"
                    :color="column.color"
                    @update:issue="emit('update:issue', $event)"
                    @delete:issue="emit('delete:issue', $event)"
                  />
                </template>
              </draggable>
            </OverlayScrollbarsComponent>
          </div>
        </article>
      </div>
    </OverlayScrollbarsComponent>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import {
  EIssueEvent,
  getErrorMessage,
  type TBoard,
  type TColumn,
  type TColumnBase,
  type TDeleteColumnEmitPayload,
  type TDeleteIssueEmitPayload,
  type TIssueBase,
  type TMoveColumnEmitPayload,
  type TMoveIssue,
  type TMoveIssueEmitPayload,
  type TMoveIssueResponse,
} from '@kanban-board/common';
import { OverlayScrollbarsComponent, type OverlayScrollbarsComponentProps } from 'overlayscrollbars-vue';

import { useSocket } from '~/composables/use-socket.composable.ts';
import type { TDragChangeDetails } from '~/types/shared.types.ts';

import BoardFilter from '~/components/sections/board/BoardFilter.vue';
import AddColumnButton from '~/components/sections/column/AddColumnButton.vue';
import ColumnActionsButtons from '~/components/sections/column/ColumnActionsButtons.vue';
import ColumnInfo from '~/components/sections/column/ColumnInfo.vue';
import ColumnTopPanel from '~/components/sections/column/ColumnTopPanel.vue';
import IssueCard from '~/components/sections/issue/IssueCard.vue';

const props = defineProps<{ board: TBoard }>();

const emit = defineEmits<{
  'add:column': [payload: TColumn];
  'update:column': [payload: TColumnBase];
  'delete:column': [payload: TDeleteColumnEmitPayload];
  'move:column': [payload: TMoveColumnEmitPayload];
  'add:issue': [payload: TIssueBase];
  'update:issue': [payload: TIssueBase];
  'delete:issue': [payload: TDeleteIssueEmitPayload];
  'move:issue': [payload: TMoveIssueEmitPayload];
  'take:snapshot': [];
  'restore:snapshot': [];
  'delete:snapshot': [];
}>();

const toast = useToast();
const { emitEvent, isLoading } = useSocket();

const onIssueChange = (details: TDragChangeDetails<TIssueBase>, column: TColumn) => {
  // При переносе между колонками removed игнорируем, запрос шлём только с added/moved.
  if (details.removed || (!details.added && !details.moved)) return;

  const change = details.added ?? details.moved;
  if (!change) return;

  const { element, newIndex } = change;
  const fromColumnId = element.columnId;
  const toColumnId = column.id;

  if (details.added) element.columnId = toColumnId;

  const body: TMoveIssue = {
    boardId: props.board.id,
    targetId: element.id,
    previousId: column.issues[newIndex - 1]?.id ?? null,
    fromColumnId,
    toColumnId: fromColumnId !== toColumnId ? toColumnId : null,
  };

  console.log(body);

  emitEvent<TMoveIssue, TMoveIssueResponse>({
    event: EIssueEvent.MOVE,
    data: body,
    successCallback: (response: TMoveIssueResponse) => {
      if (response.isSuccess && response.data) {
        toast.success({ message: 'Задача перемещена' });
        emit('move:issue', response.data);
        emit('delete:snapshot');
      }
    },
    errorCallback: (error: unknown) => {
      toast.error({ message: getErrorMessage(error) });
      emit('restore:snapshot');
    },
  });
};

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
