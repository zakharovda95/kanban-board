<template>
  <aside class="flex size-full max-w-280 flex-col items-center justify-between gap-12 py-12 pr-0 pl-12">
    <div class="bg-light-base rounded-12 flex size-full h-full flex-col gap-12 p-12">
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
            @update:boards="updateBoardsAfterUpdatingOrDeleting"
          />
        </nav>
        <div v-else class="p-8">
          <p class="text-12">{{ NO_BOARDS_TEXT }}</p>
        </div>

        <AddBoardButton @update:boards="updateBoardsAfterCreating" />
      </template>
    </div>

    <div class="bg-light-base rounded-12 w-full p-12">
      <SidebarProfileWidget />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { NO_BOARDS_TEXT } from '~/constants/board.constants';
import { useBoardsStore } from '~/stores/boards.store';
import type { TBaseAction } from '~/types/shared.types';

import SidebarBoardLink from '~/components/layouts/board/sidebar/SidebarBoardLink.vue';
import SidebarProfileWidget from '~/components/layouts/board/sidebar/SidebarProfileWidget.vue';
import AddBoardButton from '~/components/sections/board/AddBoardButton.vue';

const route = useRoute();
const boardsStore = useBoardsStore();

const updateBoardsAfterUpdatingOrDeleting = async (action: TBaseAction, id: string) => {
  await boardsStore.fetchBoards();
  if (action === 'update') return;
  if (route.params?.id && id === route.params.id) navigateTo(`/boards`);
};

const updateBoardsAfterCreating = async (id?: string) => {
  await boardsStore.fetchBoards();
  if (id) navigateTo(`/boards/${id}`);
};
</script>
