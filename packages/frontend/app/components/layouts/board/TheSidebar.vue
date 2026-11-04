<template>
  <aside class="laptop:flex hidden h-full w-280 shrink-0 flex-col items-center justify-between gap-12 py-12 pr-0 pl-12">
    <UIWidget h-full title="Мои доски">
      <BoardsList />
    </UIWidget>

    <UIWidget v-if="userStore.isOwner" title="Мое пространство">
      <TheWorkspace />
    </UIWidget>

    <UIWidget v-if="userStore.me" title="Мой профиль" body-class="flex flex-col gap-8">
      <TheProfile v-model:user="userStore.me" is-current-user />
      <LogoutButton full />
    </UIWidget>
  </aside>

  <MobileSelectPanel
    v-model:is-open="isBoardsMenuOpen"
    class="laptop:hidden block"
    button-icon="mingcute:grid-2-fill"
    modal-title="Мои доски"
    :selected-title="selectedTitle"
    :deselected-title="boardsStore.boards?.length ? 'Необходимо выбрать доску' : 'Необходимо добавить доску'"
    :is-loading="boardsStore.isLoadingBoards || boardStore.isLoadingBoard"
  >
    <BoardsList class="p-0!" @click:board="closeBoardMenu" />
  </MobileSelectPanel>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

import { useIsLaptop } from '~/composables/use-is-laptop.composable.ts';
import { useBoardStore } from '~/stores/board.store.ts';
import { useBoardsStore } from '~/stores/boards.store.ts';
import { useUserStore } from '~/stores/user.store.ts';

import LogoutButton from '~/components/layouts/shared/LogoutButton.vue';
import BoardsList from '~/components/sections/board/BoardsList.vue';
import MobileSelectPanel from '~/components/shared/MobileSelectPanel.vue';
import TheProfile from '~/components/shared/TheProfile.vue';
import TheWorkspace from '~/components/shared/TheWorkspace.vue';
import UIWidget from '~/components/ui/UIWidget.vue';

const route = useRoute();
const boardsStore = useBoardsStore();
const boardStore = useBoardStore();
const userStore = useUserStore();

const boardId = computed(() => Number(route.params.id));

const selectedTitle = computed(() => {
  if (boardStore.board?.title) return boardStore.board.title;
  return boardsStore.boards?.find(board => board.id === boardId.value)?.title ?? null;
});

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
