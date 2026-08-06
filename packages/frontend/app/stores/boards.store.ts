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

  const addNewBoard = (newBoard: TBoardBase): void => {
    boards.value.push(newBoard);
  };

  const updateBoard = (updatedBoard: TBoardBase) => {
    const targetIndex = boards.value.findIndex(({ order }: TBoardBase) => order === updatedBoard.order);
    if (targetIndex != -1) boards.value.splice(targetIndex, 1, updatedBoard);
  };

  const deleteBoard = (payload: TDeleteBoardEmitPayload) => {
    boards.value = payload.boards;
    if (payload.deletedBoardId === Number(route.params.id)) navigateTo(`/boards`);
  };

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
      addNewBoard(newBoard);
      toast.success({ message: BOARD_MESSAGES.changesOccurred });
    }
  });

  listen(EBoardEvent.UPDATED, (updatedBoard: TBoardBase) => {
    if (updatedBoard.id) {
      updateBoard(updatedBoard);
      toast.success({ message: BOARD_MESSAGES.changesOccurred });
    }
  });

  listen(EBoardEvent.DELETED, (payload: TDeleteBoardEmitPayload) => {
    if (payload.deletedBoardId) {
      deleteBoard(payload);

      if (payload.deletedBoardId === Number(route.params.id)) {
        toast.info({ message: BOARD_MESSAGES.boardWasDeleted });
      } else toast.success({ message: BOARD_MESSAGES.changesOccurred });
    }
  });

  return { isLoadingBoards, boards, fetchBoards, addNewBoard, updateBoard, deleteBoard };
});
