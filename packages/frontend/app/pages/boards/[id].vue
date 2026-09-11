<template>
  <div class="flex size-full items-center justify-center">
    <UILoader v-if="showLoader" :size="64" full />
    <div v-else-if="errorMessage" class="flex size-full items-center justify-center p-12">
      <p class="text-14 font-medium">{{ errorMessage }}</p>
    </div>
    <template v-else-if="data">
      <TheBoard
        v-if="isLaptop"
        :board="data"
        @add:column="addColumn"
        @update:column="updateColumn"
        @delete:column="deleteColumn"
        @move:column="moveColumn"
        @add:issue="addIssue"
        @update:issue="updateIssue"
        @delete:issue="deleteIssue"
      />
      <TheBoardMobile
        v-else
        :board="data"
        @add:column="addColumn"
        @update:column="updateColumn"
        @delete:column="deleteColumn"
        @move:column="moveColumn"
        @add:issue="addIssue"
        @update:issue="updateIssue"
        @delete:issue="deleteIssue"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  EBoardEvent,
  EColumnEvent,
  EIssueEvent,
  type TBoard,
  type TColumn,
  type TColumnBase,
  type TDeleteColumnEmitPayload,
  type TDeleteIssueEmitPayload,
  type TIssueBase,
  type TMoveColumnEmitPayload,
} from '@kanban-board/common';
import { orderBy } from 'lodash';

import { useIsLaptop } from '~/composables/use-is-laptop.composable.ts';
import { useSocket } from '~/composables/use-socket.composable.ts';

import TheBoard from '~/components/sections/board/TheBoard.vue';
import TheBoardMobile from '~/components/sections/board/TheBoardMobile.vue';
import UILoader from '~/components/ui/UILoader.vue';

definePageMeta({
  layout: 'board',
});

const isMounted = useMounted();
const route = useRoute();
const toast = useToast();
const { listen, $socket } = useSocket();

const boardId = computed(() => Number(route.params.id));
const isLaptop = useIsLaptop();

const errorMessage = ref<string | null>(null);

const { data, pending, error, refresh } = await useFetch<TBoard>(`/api/boards/${boardId.value}`, { deep: true });

if (error.value) {
  const message = 'Произошла ошибка при загрузке доски.';
  toast.error({ message });
  errorMessage.value = message;
}

const showLoader = computed(() => !isMounted.value || pending.value);

const addColumn = (column: TColumn) => {
  if (!column || !data.value) return;
  data.value.columns.push(column);
};

const updateColumn = (columnBase: TColumnBase) => {
  if (!columnBase || !data.value) return;

  const targetIndex = data.value.columns.findIndex(({ id }: TColumn) => id === columnBase.id);
  if (targetIndex === -1) return;

  const existingColumn = data.value.columns[targetIndex];
  if (!existingColumn) return;

  const issues = existingColumn.issues;
  data.value.columns.splice(targetIndex, 1, { ...columnBase, issues });
};

const deleteColumn = (payload: TDeleteColumnEmitPayload) => {
  if (!payload || !data.value) return;
  data.value.columns = data.value.columns.filter(({ id }) => id !== payload.deletedColumnId);
};

const moveColumn = async (moveResult: TMoveColumnEmitPayload) => {
  if (!moveResult || !data.value) return;
  // если не передан объект перемещенной колонки, значит был reorder всех колонок и нужно сделать refetch
  if (!moveResult.movedColumn) {
    await refresh();
    return;
  }
  updateColumn(moveResult.movedColumn);
  data.value.columns = orderBy(data.value.columns, ['order'], 'asc');
};

const stopListenColumnCreated = listen(EColumnEvent.CREATED, (column: TColumn) => {
  addColumn(column);
  toast.info({ message: `Добавлена новая колонка «${column.title}»` });
});

const stopListenColumnUpdated = listen(EColumnEvent.UPDATED, (column: TColumnBase) => {
  updateColumn(column);
  toast.info({ message: `Обновлена колонка «${column.title}»` });
});

const stopListenColumnDeleted = listen(EColumnEvent.DELETED, (payload: TDeleteColumnEmitPayload) => {
  const deletedColumn = data.value?.columns?.find(({ id }) => id === payload.deletedColumnId);

  deleteColumn(payload);

  toast.info({
    message: deletedColumn ? `Колонка «${deletedColumn.title}» была удалена` : 'Колонка была удалена',
  });
});

const stopListenColumnMoved = listen(EColumnEvent.MOVED, async (payload: TMoveColumnEmitPayload) => {
  if (payload.movedColumnId) {
    await moveColumn(payload);
    const movedColumn = data.value?.columns.find(({ id }: TColumn) => id === payload.movedColumnId);
    toast.info({
      message: movedColumn ? `Колонка «${movedColumn.title}» была перемещена` : 'Колонка была перемещена',
    });
  }
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
  if (targetColumn) targetColumn.issues = targetColumn.issues.filter(({ id }) => id !== payload.deletedIssueId);
};

const stopListenIssueCreated = listen(EIssueEvent.CREATED, (issue: TIssueBase) => {
  addIssue(issue);
  toast.info({ message: `Добавлена новая задача «${issue.title}»` });
});

const stopListenIssueUpdated = listen(EIssueEvent.UPDATED, (issue: TIssueBase) => {
  updateIssue(issue);
  toast.info({ message: `Обновлена задача «${issue.title}»` });
});

const stopListenIssueDeleted = listen(EIssueEvent.DELETED, (payload: TDeleteIssueEmitPayload) => {
  const deletedIssue = data.value?.columns
    ?.flatMap(column => column.issues)
    .find(({ id }) => id === payload.deletedIssueId);

  deleteIssue(payload);

  toast.info({
    message: deletedIssue ? `Задача «${deletedIssue.title}» была удалена` : 'Задача была удалена',
  });
});

onMounted(() => {
  $socket.emit(EBoardEvent.JOIN, boardId.value);
});

onBeforeUnmount(() => {
  stopListenColumnCreated();
  stopListenColumnUpdated();
  stopListenColumnDeleted();
  stopListenColumnMoved();

  stopListenIssueCreated();
  stopListenIssueUpdated();
  stopListenIssueDeleted();

  $socket.emit(EBoardEvent.LEAVE, boardId.value);
});
</script>
