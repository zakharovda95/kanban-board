<template>
  <aside class="bg-light-200 border-r-light-300 size-full max-w-280 border-r">
    <UILoader v-if="boardsStore.isLoadingBoards" full />
    <div v-else-if="!boardsStore.isLoadingBoards && boardsStore.boards.length" class="w-full">
      <UILink
        v-for="board in boardsStore.boards"
        :key="board.id"
        :to="`/boards/${board.id}`"
        :hoverable="false"
        direction="row-reverse"
        class="border-b-light-300 flex w-full cursor-pointer border-r-4 border-b border-r-transparent p-8 duration-300"
        :class="{ 'border-r-light-400! bg-light-300!': isActiveBoard(board.id) }"
        :icon="isActiveBoard(board.id) ? 'eye-line' : 'eye-close-line'"
        :icon-size="28"
      >
        <div class="flex w-[calc(100%-32px)] flex-col gap-4 text-left">
          <span class="text-14 block overflow-hidden font-medium text-ellipsis whitespace-nowrap">
            {{ board.title }}
          </span>
          <span class="text-12 text-light-800 block overflow-hidden font-light text-ellipsis whitespace-nowrap">
            {{ board.description }}
          </span>
        </div>
      </UILink>
    </div>
    <div v-else class="p-8 text-center">
      <span class="text-12 text-light-800">Вы еще не создали не одной доски.</span>
    </div>

    <div class="p-8">
      <UIButton prepend-icon="add-line" full>Добавить доску</UIButton>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useBoardsStore } from '~/stores/boards.store';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UILink from '~/components/ui/links/UILink.vue';

const route = useRoute();
const boardsStore = useBoardsStore();

const isActiveBoard = (boardId: number) => Number(route.params.id) === boardId;
</script>
