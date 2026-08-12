<template>
  <div class="flex size-full items-center justify-center">
    <TheBoard :board="data ?? null" :is-loading="pending" :error-text="errorMessage" @add:column="addColumn" />
  </div>
</template>

<script setup lang="ts">
import { EColumnEvent, type TBoard, type TColumn } from '@kanban-board/common';

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

listen(EColumnEvent.CREATED, (column: TColumn) => {
  addColumn(column);
  toast.success({ message: BOARD_MESSAGES.boardUpdated });
});
</script>
