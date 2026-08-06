<template>
  <div class="flex size-full items-center justify-center p-12">
    <p class="text-14 font-medium">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { BOARD_MESSAGES } from '~/constants/board.constants';
import { useBoardsStore } from '~/stores/boards.store';

definePageMeta({
  layout: 'board',
});

const boardsStore = useBoardsStore();

const text = computed(() =>
  boardsStore.isLoadingBoards
    ? BOARD_MESSAGES.loadBoard
    : boardsStore.boards?.length && !boardsStore.isLoadingBoards
      ? BOARD_MESSAGES.chooseBoard
      : BOARD_MESSAGES.noBoards,
);

if (boardsStore.boards?.length) {
  navigateTo(`/boards/${boardsStore.boards?.[0]?.id}`);
}
</script>
