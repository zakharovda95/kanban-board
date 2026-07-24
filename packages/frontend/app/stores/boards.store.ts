import type { TBoardBase } from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';

export const useBoardsStore = defineStore('boards-store', () => {
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

  return { isLoadingBoards, boards, fetchBoards };
});
