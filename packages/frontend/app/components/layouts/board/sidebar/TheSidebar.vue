<template>
  <aside class="flex h-full w-280 shrink-0 flex-col items-center justify-between gap-12 py-12 pr-0 pl-12">
    <div class="bg-light-base rounded-12 flex size-full h-full flex-col gap-12 p-12">
      <UILoader v-if="boardsStore.isLoadingBoards" full />
      <template v-else>
        <h4 class="font-medium">Мои доски</h4>
        <nav
          v-if="!boardsStore.isLoadingBoards && boardsStore.boards?.length"
          class="flex h-fit w-full flex-col gap-8 overflow-hidden"
        >
          <UILink
            v-for="board in boardsStore.boards"
            :key="board.id"
            :to="`/boards/${board.id}`"
            :hoverable="false"
            class="border-light-200 rounded-8 bg-light-base flex h-60 w-full flex-1 shrink-0 cursor-pointer items-center justify-between gap-8 border p-8 duration-300 select-none"
            :class="{ 'border-green!': board.id === Number(route.params?.id) }"
          >
            <div class="w-[calc(100%-32px)] text-left">
              <p class="text-14 block overflow-hidden font-medium text-ellipsis whitespace-nowrap">
                {{ board.title }}
              </p>
              <p class="text-12 block overflow-hidden font-light text-ellipsis whitespace-nowrap">
                {{ board.description }}
              </p>
            </div>

            <BoardActionsButtons
              :board="board"
              @update:board="boardsStore.updateBoard"
              @delete:board="boardsStore.deleteBoard"
            />
          </UILink>
        </nav>
        <div v-else class="p-8">
          <p class="text-12">{{ BOARD_MESSAGES.noBoards }}</p>
        </div>

        <AddBoardButton @add:board="boardsStore.addNewBoard" />
      </template>
    </div>

    <div class="bg-light-base rounded-12 w-full p-12">
      <SidebarProfileWidget />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { BOARD_MESSAGES } from '~/constants/board.constants';
import { useBoardsStore } from '~/stores/boards.store';

import SidebarProfileWidget from '~/components/layouts/board/sidebar/SidebarProfileWidget.vue';
import AddBoardButton from '~/components/sections/board/AddBoardButton.vue';
import BoardActionsButtons from '~/components/sections/board/BoardActionsButtons.vue';
import UILink from '~/components/ui/UILink.vue';
import UILoader from '~/components/ui/UILoader.vue';

const route = useRoute();
const boardsStore = useBoardsStore();
</script>
