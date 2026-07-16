<template>
  <div class="flex h-full flex-1 items-center justify-center self-stretch">
    <span class="font-medium"> {{ text }} </span>
  </div>
</template>

<script setup lang="ts">
import { NO_BOARDS_TEXT } from '~/constants/board.constants';
import { useBoardsStore } from '~/stores/boards.store';

definePageMeta({
  layout: 'board',
});

const boardsStore = useBoardsStore();

const text = computed(() =>
  boardsStore.isLoadingBoards
    ? 'Загружаем Ваши доски...'
    : boardsStore.boards.length && !boardsStore.isLoadingBoards
      ? 'Выберите доску в меню слева'
      : NO_BOARDS_TEXT,
);

if (boardsStore.boards.length) {
  navigateTo(`/boards/${boardsStore.boards[0]?.id}`);
}
</script>
