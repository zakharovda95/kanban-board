<template>
  <div class="flex h-full flex-1 items-center justify-center self-stretch">
    <span class="text-18 text-light-800 font-medium"> {{ text }} </span>
  </div>
</template>

<script setup lang="ts">
import { useBoardsStore } from '~/stores/boards.store';

definePageMeta({
  layout: 'boards',
});

const boardsStore = useBoardsStore();

const text = computed(() =>
  boardsStore.isLoadingBoards
    ? 'Загружаем Ваши доски...'
    : boardsStore.boards.length && !boardsStore.isLoadingBoards
      ? 'Выберите доску в меню слева'
      : 'Вы еще не создали ни одной доски. Создайте Вашу первую доску.',
);

if (boardsStore.boards.length) {
  navigateTo(`/boards/${boardsStore.boards[0]?.id}`);
}
</script>
