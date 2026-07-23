import type { TBoardBase } from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';

export const useBoardsStore = defineStore('boards-store', () => {
  const {
    data: boards,
    isLoading: isLoadingBoards,
    call: fetchBoards,
  } = useTryCatchFinally<TBoardBase[]>({
    callback: async () => await $fetch<TBoardBase[]>('/api/boards', { method: 'GET' }),
  });

  return { isLoadingBoards, boards: boards ?? [], fetchBoards };
});
