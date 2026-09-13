<template>
  <div class="flex size-full flex-col items-center gap-12 p-12">
    <BoardFilter />

    <div v-if="!board?.columns.length" class="flex size-full flex-col items-center justify-center gap-8 p-12">
      <p class="text-14 font-medium">Для начала работы необходимо добавить колонку.</p>
      <AddColumnButton />
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
                :disabled="isLoading"
                @start="boardStore.takeSnapshot"
                @change="onIssueChange($event, column)"
              >
                <template #item="{ element: issue }">
                  <IssueCard
                    :issue="issue"
                    :color="column.color"
                    :is-loading="isLoadingIssueDetails && selectedIssueId === issue.id"
                    @open:details="openIssueDetails"
                  />
                </template>
              </draggable>
            </OverlayScrollbarsComponent>
          </div>
        </article>
      </div>
    </OverlayScrollbarsComponent>

    <IssueDetailsModal
      v-if="issueDetails"
      :is-open="isModalOpen"
      :issue="issueDetails"
      :stages="stages"
      @update:is-open="onModalOpenChange"
      @update:issue="updateIssue"
      @delete:issue="onDeleteIssue"
      @change:stage="emitMove"
    />
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import {
  EIssueEvent,
  getErrorMessage,
  type TColumn,
  type TDeleteIssueEmitPayload,
  type TIssue,
  type TIssueBase,
  type TMoveIssue,
  type TMoveIssueResponse,
} from '@kanban-board/common';
import { OverlayScrollbarsComponent, type OverlayScrollbarsComponentProps } from 'overlayscrollbars-vue';

import { useSocket } from '~/composables/use-socket.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import { useBoardStore } from '~/stores/board.store.ts';
import type { TDragChangeDetails } from '~/types/shared.types.ts';
import type { TUISelectOption } from '~/types/ui.types.ts';

import BoardFilter from '~/components/sections/board/BoardFilter.vue';
import AddColumnButton from '~/components/sections/column/AddColumnButton.vue';
import ColumnActionsButtons from '~/components/sections/column/ColumnActionsButtons.vue';
import ColumnInfo from '~/components/sections/column/ColumnInfo.vue';
import ColumnTopPanel from '~/components/sections/column/ColumnTopPanel.vue';
import IssueCard from '~/components/sections/issue/IssueCard.vue';
import IssueDetailsModal from '~/components/sections/issue/IssueDetailsModal.vue';

const boardStore = useBoardStore();
const board = computed(() => boardStore.board);
const toast = useToast();
const router = useRouter();
const route = useRoute();
const { emitEvent, listen, isLoading } = useSocket();

const stages = computed<TUISelectOption[]>(
  () => board.value?.columns.map(({ id, title }) => ({ id, label: title })) ?? [],
);

const issueIdFromQuery = computed(() => {
  if (!route.query?.issue) return null;
  const queryId = String(route.query.issue).split('-')?.[1];
  if (!queryId) return null;
  return Number(queryId);
});

const selectedIssueId = ref<number | null>(issueIdFromQuery.value);
const isModalOpen = ref(Boolean(issueIdFromQuery.value));

const {
  data: issueDetails,
  isLoading: isLoadingIssueDetails,
  call: fetchIssueDetails,
} = useTryCatchFinally({
  callback: async () => {
    if (!selectedIssueId.value) return null;
    return $fetch<TIssue>(`/api/issues/${selectedIssueId.value}`, { method: 'GET' });
  },
  catchCallback: (error: unknown) => toast.error({ message: getErrorMessage(error) }),
  callOnInit: Boolean(issueIdFromQuery.value),
});

let stopListen: (() => void) | null = null;

// Если у кого-то открыта детальная задачи, и в это время были внесены изменения - реактивный апдейт задачи.
const subscribeToIssueUpdates = () => {
  if (stopListen) stopListen();

  stopListen = listen(EIssueEvent.UPDATED, (updatedIssue: TIssueBase) => {
    if (updatedIssue.id === selectedIssueId.value) fetchIssueDetails();
  });
};

if (issueIdFromQuery.value) subscribeToIssueUpdates();

const openIssueDetails = async (issue: TIssueBase) => {
  if (isLoadingIssueDetails.value) return;

  selectedIssueId.value = issue.id;
  await fetchIssueDetails();

  isModalOpen.value = true;
  router.replace({ query: { ...route.query, issue: `task-${issue.id}` } });
  subscribeToIssueUpdates();
};

const closeIssueDetails = () => {
  isModalOpen.value = false;
  selectedIssueId.value = null;
  router.replace({ query: { ...route.query, issue: undefined } });

  if (stopListen) {
    stopListen();
    stopListen = null;
  }
};

const onModalOpenChange = (isOpen: boolean) => {
  if (!isOpen) closeIssueDetails();
};

const updateIssue = (issue: TIssueBase) => {
  fetchIssueDetails();
  boardStore.updateIssue(issue);
};

const onDeleteIssue = (payload: TDeleteIssueEmitPayload) => {
  boardStore.deleteIssue(payload);
  closeIssueDetails();
};

const onIssueChange = (details: TDragChangeDetails<TIssueBase>, column: TColumn) => {
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

  emitMove(body);
};

const emitMove = (body: TMoveIssue) => {
  emitEvent<TMoveIssue, TMoveIssueResponse>({
    event: EIssueEvent.MOVE,
    data: body,
    successCallback: async (response: TMoveIssueResponse) => {
      if (response.isSuccess && response.data) {
        toast.success({ message: 'Задача перемещена' });
        await boardStore.moveIssue(response.data);

        const movedIssue = response.data.movedIssue;
        if (movedIssue && issueDetails.value?.id === movedIssue.id) {
          issueDetails.value = { ...issueDetails.value, columnId: movedIssue.columnId };
        }

        boardStore.deleteSnapshot();
      }
    },
    errorCallback: (error: unknown) => {
      toast.error({ message: getErrorMessage(error) });
      boardStore.restoreSnapshot();
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

onBeforeUnmount(() => {
  if (stopListen) stopListen();
});
</script>
