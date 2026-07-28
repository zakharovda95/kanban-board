<template>
  <div class="flex size-full items-center justify-center p-12">
    <p class="text-14 font-medium">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { CHOOSE_ONE_BOARD_TEXT, LOAD_BOARDS_TEXT, NO_BOARDS_TEXT } from '~/constants/board.constants';
import { useBoardsStore } from '~/stores/boards.store';

definePageMeta({
  layout: 'board',
});

const boardsStore = useBoardsStore();

const text = computed(() =>
  boardsStore.isLoadingBoards
    ? LOAD_BOARDS_TEXT
    : boardsStore.boards?.length && !boardsStore.isLoadingBoards
      ? CHOOSE_ONE_BOARD_TEXT
      : NO_BOARDS_TEXT,
);

if (boardsStore.boards?.length) {
  navigateTo(`/boards/${boardsStore.boards?.[0]?.id}`);
}
</script>
