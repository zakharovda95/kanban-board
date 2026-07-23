<template>
  <aside class="flex size-full max-w-280 items-center justify-center py-12 pr-0 pl-12">
    <div class="bg-light-base rounded-12 size-full h-full p-12">
      <UILoader v-if="boardsStore.isLoadingBoards" full />
      <template v-else>
        <nav
          v-if="!boardsStore.isLoadingBoards && boardsStore.boards?.length"
          class="flex max-h-[calc(100%-44px)] w-full flex-col gap-8 overflow-hidden"
        >
          <SidebarBoardLink
            v-for="board in boardsStore.boards"
            :key="board.id"
            :board="board"
            @update:boards="boardsStore.fetchBoards"
          />
        </nav>
        <div v-else class="p-8">
          <p class="text-12">{{ NO_BOARDS_TEXT }}</p>
        </div>
        <SidebarAddBoardButton class="mt-12" @update:boards="boardsStore.fetchBoards" />
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { NO_BOARDS_TEXT } from '~/constants/board.constants';
import { useBoardsStore } from '~/stores/boards.store';

import SidebarAddBoardButton from '~/components/layouts/board/sidebar/SidebarAddBoardButton.vue';
import SidebarBoardLink from '~/components/layouts/board/sidebar/SidebarBoardLink.vue';

const boardsStore = useBoardsStore();
</script>
