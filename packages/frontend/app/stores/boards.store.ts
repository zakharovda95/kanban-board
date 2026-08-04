import { EBoardEvent, type TBoardBase } from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';

export const useBoardsStore = defineStore('boards-store', () => {
  const { $socket } = useNuxtApp();
  const isLoadingBoards = ref(false);
  const boards = ref<TBoardBase[]>([]);

  const { call: fetchBoards } = useTryCatchFinally({
    callback: async () => {
      isLoadingBoards.value = true;
      boards.value = await $fetch<TBoardBase[]>('/api/boards', { method: 'GET' });
    },
    finallyCallback: () => {
      isLoadingBoards.value = false;
    },
  });

  $socket?.on(EBoardEvent.CREATED, (newBoard: TBoardBase) => {
    if (newBoard.id) boards.value.push(newBoard);
  });

  return { isLoadingBoards, boards, fetchBoards };
});
