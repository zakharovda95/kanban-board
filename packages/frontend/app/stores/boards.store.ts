import {
  EBoardEvent,
  type TBoardBase,
  type TDeleteBoardEmitPayload,
  type TMoveBoardEmitPayload,
} from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useSocket } from '~/composables/use-socket.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';

export const useBoardsStore = defineStore('boards-store', () => {
  const { listen } = useSocket();
  const toast = useToast();
  const route = useRoute();

  const isLoadingBoards = ref(false);
  const boards = ref<TBoardBase[]>([]);
  const snapshot = ref<TBoardBase[] | null>(null);

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
      toast.info({ message: `Добавлена новая доска «${newBoard.title}»` });
    }
  });

  const stopListenUpdated = listen(EBoardEvent.UPDATED, (updatedBoard: TBoardBase) => {
    if (updatedBoard.id) {
      updateBoard(updatedBoard);
      toast.info({ message: `Обновлена доска «${updatedBoard.title}»` });
    }
  });

  const stopListenDeleted = listen(EBoardEvent.DELETED, (payload: TDeleteBoardEmitPayload) => {
    if (payload.deletedBoardId) {
      const deletedBoard = boards.value.find(({ id }) => id === payload.deletedBoardId);
      deleteBoard(payload);

      if (payload.deletedBoardId === currentBoardId.value) {
        toast.info({ message: 'Активная доска была удалена и больше недоступна' });
      } else
        toast.info({
          message: deletedBoard ? `Доска «${deletedBoard.title}» была удалена` : 'Доска была удалена',
        });
    }
  });

  const stopListenMove = listen(EBoardEvent.MOVED, (payload: TMoveBoardEmitPayload) => {
    if (payload.movedBoardId) {
      boards.value = [...payload.boards];
      const movedBoard = boards.value.find(({ id }: TBoardBase) => id === payload.movedBoardId);
      toast.info({
        message: movedBoard ? `Доска «${movedBoard.title}» была перемещена` : 'Доска была перемещена',
      });
    }
  });

  const stopListen = () => {
    stopListenCreated();
    stopListenUpdated();
    stopListenDeleted();
    stopListenMove();
  };

  const resetStore = () => {
    isLoadingBoards.value = false;
    boards.value = [];
  };

  const takeSnapshot = () => {
    snapshot.value = structuredClone(boards.value.map(elem => toRaw(elem)));
  };

  const deleteSnapshot = () => {
    snapshot.value = null;
  };

  return {
    isLoadingBoards,
    boards,
    snapshot,
    fetchBoards,
    addNewBoard,
    updateBoard,
    deleteBoard,
    stopListen,
    resetStore,
    takeSnapshot,
    deleteSnapshot,
  };
});
