import type { TBoardBase } from '@kanban-board/common';
import { defineStore } from 'pinia';

export const useBoardsStore = defineStore('boards-store', () => {
  const isLoadingBoards = ref(false);
  const boards = ref<TBoardBase[]>([]);

  const fetchBoards = async () => {
    try {
      isLoadingBoards.value = true;
      const result = await $fetch<TBoardBase[]>('/api/boards', { method: 'GET' });
      if (result.length) boards.value = result;
    } catch (error: unknown) {
      console.log(error);
    } finally {
      isLoadingBoards.value = false;
    }
  };

  return { isLoadingBoards, boards, fetchBoards };
});
