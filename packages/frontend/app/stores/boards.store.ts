import { EBoardEvent, type TBoardBase } from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useSocket } from '~/composables/use-socket.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';

export const useBoardsStore = defineStore('boards-store', () => {
  const { listen } = useSocket();
  const toast = useToast();

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

  listen(EBoardEvent.CREATED, (newBoard: TBoardBase) => {
    if (newBoard.id) {
      boards.value.push(newBoard);
      toast.success({ message: 'Добавлена новая доска!' });
    }
  });

  listen(EBoardEvent.UPDATED, (updatedBoard: TBoardBase) => {
    if (updatedBoard.id) {
      const targetIndex = boards.value.findIndex(({ order }: TBoardBase) => order === updatedBoard.order);
      if (targetIndex != -1) {
        boards.value.splice(targetIndex, 1, updatedBoard);
        toast.success({ message: 'Список досок обновлен!' });
      }
    }
  });

  return { isLoadingBoards, boards, fetchBoards };
});
