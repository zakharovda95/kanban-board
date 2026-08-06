import { EBoardEvent, type TBoardBase, type TDeleteBoardEmitPayload } from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useSocket } from '~/composables/use-socket.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import { BOARD_MESSAGES } from '~/constants/board.constants.ts';

export const useBoardsStore = defineStore('boards-store', () => {
  const { listen } = useSocket();
  const toast = useToast();
  const route = useRoute();

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
      toast.success({ message: BOARD_MESSAGES.changesOccurred });
    }
  });

  listen(EBoardEvent.UPDATED, (updatedBoard: TBoardBase) => {
    if (updatedBoard.id) {
      const targetIndex = boards.value.findIndex(({ order }: TBoardBase) => order === updatedBoard.order);
      if (targetIndex != -1) {
        boards.value.splice(targetIndex, 1, updatedBoard);
        toast.success({ message: BOARD_MESSAGES.changesOccurred });
      }
    }
  });

  listen(EBoardEvent.DELETED, (boardsAfterDeleting: TDeleteBoardEmitPayload) => {
    if (boardsAfterDeleting.deletedBoardId) {
      boards.value = boardsAfterDeleting.boards;
      toast.success({ message: BOARD_MESSAGES.changesOccurred });

      if (boardsAfterDeleting.deletedBoardId === Number(route.params.id)) {
        navigateTo(`/boards`);
        toast.info({ message: BOARD_MESSAGES.boardWasDeleted });
      }
    }
  });

  return { isLoadingBoards, boards, fetchBoards };
});
