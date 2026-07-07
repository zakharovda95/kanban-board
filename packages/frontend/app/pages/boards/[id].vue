<template>
  <div class="flex size-full items-center justify-center">
    <TheBoard :board="board ?? null" :is-loading="isLoadingBoard" />
  </div>
</template>

<script setup lang="ts">
import type { TBoard } from '@kanban-board/common';

import TheBoard from '~/components/pages/board/TheBoard.vue';

definePageMeta({
  layout: 'boards',
});

const route = useRoute();

const { data: board, pending: isLoadingBoard } = await useAsyncData(
  `fetch-board-${route.params.id}`,
  async () => await $fetch<TBoard>(`/api/boards/${route.params.id}`),
);
</script>
