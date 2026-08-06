<template>
  <div class="flex size-full items-center justify-center">
    <TheBoard :board="data ?? null" :is-loading="pending" :error-text="errorMessage" @update:board="refresh" />
  </div>
</template>

<script setup lang="ts">
import type { TBoard } from '@kanban-board/common';

import { BOARD_MESSAGES } from '~/constants/board.constants';

import TheBoard from '~/components/sections/board/TheBoard.vue';

definePageMeta({
  layout: 'board',
});

const route = useRoute();
const toast = useToast();

const errorMessage = ref<string | null>(null);

const { data, pending, error, refresh } = await useFetch<TBoard>(`/api/boards/${route.params.id}`);

if (error.value) {
  toast.error({ message: BOARD_MESSAGES.errorLoading });
  errorMessage.value = BOARD_MESSAGES.errorLoading;
}
</script>
