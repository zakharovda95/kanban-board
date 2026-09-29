<template>
  <aside class="laptop:flex hidden h-full w-280 shrink-0 flex-col items-center justify-between gap-12 py-12 pr-0 pl-12">
    <BoardsList />
    <div class="bg-light-base rounded-12 w-full p-12">
      <TheProfile />
    </div>
  </aside>

  <MobileSelectPanel
    v-model:is-open="isBoardsMenuOpen"
    class="laptop:hidden block"
    button-icon="mingcute:grid-2-fill"
    modal-title="Мои доски"
    :selected-title="boardStore.board?.title ?? null"
    :deselected-title="boardsStore.boards?.length ? 'Необходимо выбрать доску' : 'Необходимо добавить доску'"
    :is-loading="boardsStore.isLoadingBoards || boardStore.isLoadingBoard"
    :tooltip-text="boardStore.board?.description ?? null"
  >
    <BoardsList class="p-0!" hide-title @click:board="closeBoardMenu" />
  </MobileSelectPanel>
</template>

<script setup lang="ts">
import { useIsLaptop } from '~/composables/use-is-laptop.composable.ts';
import { useBoardStore } from '~/stores/board.store.ts';
import { useBoardsStore } from '~/stores/boards.store.ts';

import BoardsList from '~/components/sections/board/BoardsList.vue';
import MobileSelectPanel from '~/components/shared/MobileSelectPanel.vue';
import TheProfile from '~/components/shared/TheProfile.vue';

const boardsStore = useBoardsStore();
const boardStore = useBoardStore();

const isBoardsMenuOpen = ref(false);

const closeBoardMenu = () => {
  isBoardsMenuOpen.value = false;
};

useIsLaptop({
  onTrue: () => {
    closeBoardMenu();
  },
});

onBeforeUnmount(() => {
  closeBoardMenu();
});
</script>
