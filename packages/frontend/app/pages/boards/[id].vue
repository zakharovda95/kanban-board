<template>
  <div class="flex size-full items-center justify-center">
    <TheBoard
      :board="data ?? null"
      :is-loading="pending"
      :error-text="errorMessage"
      @add:column="addColumn"
      @update:column="updateColumn"
      @delete:column="deleteColumn"
      @add:issue="addIssue"
      @update:issue="updateIssue"
      @delete:issue="deleteIssue"
    />
  </div>
</template>

<script setup lang="ts">
import {
  EColumnEvent,
  EIssueEvent,
  type TBoard,
  type TColumn,
  type TDeleteColumnEmitPayload,
  type TDeleteIssueEmitPayload,
  type TIssueBase,
} from '@kanban-board/common';

import { useSocket } from '~/composables/use-socket.composable.ts';
import { BOARD_MESSAGES } from '~/constants/board.constants';

import TheBoard from '~/components/sections/board/TheBoard.vue';

definePageMeta({
  layout: 'board',
});

const route = useRoute();
const toast = useToast();
const { listen } = useSocket();

const errorMessage = ref<string | null>(null);

const { data, pending, error } = await useFetch<TBoard>(`/api/boards/${route.params.id}`, { deep: true });

if (error.value) {
  toast.error({ message: BOARD_MESSAGES.errorLoading });
  errorMessage.value = BOARD_MESSAGES.errorLoading;
}

const addColumn = (column: TColumn) => {
  if (!column || !data.value) return;
  data.value.columns.push(column);
};

const updateColumn = (column: TColumn) => {
  if (!column || !data.value) return;
  const targetIndex = data.value.columns.findIndex(({ id }: TColumn) => id === column.id);
  if (targetIndex != -1) data.value.columns.splice(targetIndex, 1, column);
};

const deleteColumn = (payload: TDeleteColumnEmitPayload) => {
  if (!payload || !data.value) return;
  data.value.columns = payload.columns;
};

listen(EColumnEvent.CREATED, (column: TColumn) => {
  addColumn(column);
  toast.success({ message: BOARD_MESSAGES.boardUpdated });
});

listen(EColumnEvent.UPDATED, (column: TColumn) => {
  updateColumn(column);
  toast.success({ message: BOARD_MESSAGES.boardUpdated });
});

listen(EColumnEvent.DELETED, (payload: TDeleteColumnEmitPayload) => {
  deleteColumn(payload);
  toast.success({ message: BOARD_MESSAGES.boardUpdated });
});

const addIssue = (issue: TIssueBase) => {
  if (!issue || !data.value) return;
  const targetColumn = data.value.columns.find(({ id }) => id === issue.columnId);
  if (targetColumn) targetColumn.issues.push(issue);
};

const updateIssue = (issue: TIssueBase) => {
  if (!issue || !data.value) return;
  const targetColumn = data.value.columns.find(({ id }) => id === issue.columnId);
  if (!targetColumn) return;
  const targetIndex = targetColumn.issues.findIndex(({ id }) => id === issue.id);
  if (targetIndex != -1) targetColumn.issues.splice(targetIndex, 1, issue);
};

const deleteIssue = (payload: TDeleteIssueEmitPayload) => {
  if (!payload || !data.value) return;
  const deletedIssue = data.value.columns
    .flatMap(column => column.issues)
    .find(({ id }) => id === payload.deletedIssueId);

  if (deletedIssue) {
    const targetColumn = data.value.columns.find(({ id }) => id === deletedIssue.columnId);
    if (targetColumn) targetColumn.issues = payload.issues;
  }
};

listen(EIssueEvent.CREATED, (issue: TIssueBase) => {
  addIssue(issue);
  toast.success({ message: BOARD_MESSAGES.boardUpdated });
});

listen(EIssueEvent.UPDATED, (issue: TIssueBase) => {
  // TODO: На данный момент если у подписчика открыта детальная задачи, а по ней пришли изменения после редактирования кем-то еще, то детальная подписчика не рефетчится. Нужно придумать решение.
  updateIssue(issue);
  toast.success({ message: BOARD_MESSAGES.boardUpdated });
});

listen(EIssueEvent.DELETED, (payload: TDeleteIssueEmitPayload) => {
  deleteIssue(payload);
  toast.success({ message: BOARD_MESSAGES.boardUpdated });
});
</script>
