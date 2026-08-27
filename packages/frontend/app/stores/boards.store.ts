import { EBoardEvent, type TBoardBase, type TDeleteBoardEmitPayload } from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useSocket } from '~/composables/use-socket.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import { BOARD_MESSAGES } from '~/constants/messages.constants.ts';

export const useBoardsStore = defineStore('boards-store', () => {
  const { listen } = useSocket();
  const toast = useToast();
  const route = useRoute();

  const isLoadingBoards = ref(false);
  const boards = ref<TBoardBase[]>([]);

  const currentBoardId = computed(() => Number(route.params.id));

  const { call: fetchBoards } = useTryCatchFinally({
    callback: async () => {
      isLoadingBoards.value = true;
      boards.value = await $fetch<TBoardBase[]>('/api/boards', { method: 'GET' });
    },
    finallyCallback: () => {
      isLoadingBoards.value = false;
    },
  });

  const addNewBoard = (newBoard: TBoardBase): void => {
    if (!newBoard) return;
    boards.value.push(newBoard);
  };

  const updateBoard = (updatedBoard: TBoardBase) => {
    if (!updatedBoard) return;

    const targetIndex = boards.value.findIndex(({ id }: TBoardBase) => id === updatedBoard.id);
    if (targetIndex != -1) boards.value.splice(targetIndex, 1, updatedBoard);
  };

  const deleteBoard = (payload: TDeleteBoardEmitPayload) => {
    if (!payload) return;

    boards.value = payload.boards;
    if (payload.deletedBoardId === currentBoardId.value) navigateTo(`/boards`);
  };

  const stopListenCreated = listen(EBoardEvent.CREATED, (newBoard: TBoardBase) => {
    if (newBoard.id) {
      addNewBoard(newBoard);
      toast.info({ message: BOARD_MESSAGES.newBoardAdded(newBoard.title) });
    }
  });

  const stopListenUpdated = listen(EBoardEvent.UPDATED, (updatedBoard: TBoardBase) => {
    if (updatedBoard.id) {
      updateBoard(updatedBoard);
      toast.info({ message: BOARD_MESSAGES.boardWasUpdated(updatedBoard.title) });
    }
  });

  const stopListenDeleted = listen(EBoardEvent.DELETED, (payload: TDeleteBoardEmitPayload) => {
    if (payload.deletedBoardId) {
      const deletedBoard = boards.value.find(({ id }) => id === payload.deletedBoardId);
      deleteBoard(payload);

      if (payload.deletedBoardId === currentBoardId.value) {
        toast.info({ message: BOARD_MESSAGES.activeBoardWasDeleted });
      } else
        toast.info({
          message: deletedBoard
            ? BOARD_MESSAGES.boardWasDeleted(deletedBoard.title)
            : BOARD_MESSAGES.namelessBoardWasDeleted,
        });
    }
  });

  const stopListen = () => {
    stopListenCreated();
    stopListenUpdated();
    stopListenDeleted();
  };

  const resetStore = () => {
    isLoadingBoards.value = false;
    boards.value = [];
  };

  return { isLoadingBoards, boards, fetchBoards, addNewBoard, updateBoard, deleteBoard, stopListen, resetStore };
});
