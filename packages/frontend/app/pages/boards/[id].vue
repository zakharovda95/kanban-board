<template>
  <div class="flex size-full items-center justify-center">
    <TheBoard
      class="laptop:block hidden"
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
    <TheBoardMobile
      class="laptop:hidden flex"
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
  EBoardEvent,
  EColumnEvent,
  EIssueEvent,
  type TBoard,
  type TColumn,
  type TDeleteColumnEmitPayload,
  type TDeleteIssueEmitPayload,
  type TIssueBase,
} from '@kanban-board/common';

import { useSocket } from '~/composables/use-socket.composable.ts';
import { COLUMN_MESSAGES, ISSUE_MESSAGES } from '~/constants/messages.constants.ts';

import TheBoard from '~/components/sections/board/TheBoard.vue';
import TheBoardMobile from '~/components/sections/board/TheBoardMobile.vue';

definePageMeta({
  layout: 'board',
});

const route = useRoute();
const toast = useToast();
const { listen, $socket } = useSocket();

const boardId = computed(() => Number(route.params.id));

const errorMessage = ref<string | null>(null);

const { data, pending, error } = await useFetch<TBoard>(`/api/boards/${boardId.value}`, { deep: true });

if (error.value) {
  const message = 'Произошла ошибка при загрузке доски.';
  toast.error({ message });
  errorMessage.value = message;
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

const stopListenColumnCreated = listen(EColumnEvent.CREATED, (column: TColumn) => {
  addColumn(column);
  toast.info({ message: COLUMN_MESSAGES.newColumnAdded(column.title) });
});

const stopListenColumnUpdated = listen(EColumnEvent.UPDATED, (column: TColumn) => {
  updateColumn(column);
  toast.info({ message: COLUMN_MESSAGES.columnWasUpdated(column.title) });
});

const stopListenColumnDeleted = listen(EColumnEvent.DELETED, (payload: TDeleteColumnEmitPayload) => {
  const deletedColumn = data.value?.columns?.find(({ id }) => id === payload.deletedColumnId);

  deleteColumn(payload);

  toast.info({
    message: deletedColumn
      ? COLUMN_MESSAGES.columnWasDeleted(deletedColumn.title)
      : COLUMN_MESSAGES.namelessColumnWasDeleted,
  });
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

  const targetColumn = data.value.columns.find(({ id }) => id === payload.columnId);
  if (targetColumn) targetColumn.issues = payload.issues;
};

const stopListenIssueCreated = listen(EIssueEvent.CREATED, (issue: TIssueBase) => {
  addIssue(issue);
  toast.info({ message: ISSUE_MESSAGES.newIssueAdded(issue.title) });
});

const stopListenIssueUpdated = listen(EIssueEvent.UPDATED, (issue: TIssueBase) => {
  updateIssue(issue);
  toast.info({ message: ISSUE_MESSAGES.issueWasUpdated(issue.title) });
});

const stopListenIssueDeleted = listen(EIssueEvent.DELETED, (payload: TDeleteIssueEmitPayload) => {
  const deletedIssue = data.value?.columns
    ?.flatMap(column => column.issues)
    .find(({ id }) => id === payload.deletedIssueId);

  deleteIssue(payload);

  toast.info({
    message: deletedIssue ? ISSUE_MESSAGES.issueWasDeleted(deletedIssue.title) : ISSUE_MESSAGES.namelessIssueWasDeleted,
  });
});

onMounted(() => {
  $socket.emit(EBoardEvent.JOIN, boardId.value);
});

onBeforeUnmount(() => {
  stopListenColumnCreated();
  stopListenColumnUpdated();
  stopListenColumnDeleted();

  stopListenIssueCreated();
  stopListenIssueUpdated();
  stopListenIssueDeleted();

  $socket.emit(EBoardEvent.LEAVE, boardId.value);
});
</script>
