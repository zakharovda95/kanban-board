<template>
  <div class="flex size-full flex-col items-center justify-center gap-8 p-12">
    <p class="text-14 font-medium">{{ text }}</p>
    <AddBoardButton v-if="!hasSomeBoards" :full="false" @add:board="boardsStore.addNewBoard" />
  </div>
</template>

<script setup lang="ts">
import { useBoardsStore } from '~/stores/boards.store';

import AddBoardButton from '~/components/sections/board/AddBoardButton.vue';

definePageMeta({
  layout: 'board',
});

const boardsStore = useBoardsStore();

const hasSomeBoards = computed(() => boardsStore.boards?.length && !boardsStore.isLoadingBoards);

const text = computed(() =>
  boardsStore.isLoadingBoards
    ? 'Загружаем доски...'
    : hasSomeBoards.value
      ? 'Выберите доску в меню слева.'
      : 'Для начала работы необходимо добавить доску.',
);

if (boardsStore.boards?.length) {
  navigateTo(`/boards/${boardsStore.boards?.[0]?.id}`);
}
</script>
