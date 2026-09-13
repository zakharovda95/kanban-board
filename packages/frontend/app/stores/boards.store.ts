import {
  EBoardEvent,
  type TBoardBase,
  type TDeleteBoardEmitPayload,
  type TMoveBoardEmitPayload,
} from '@kanban-board/common';
import { cloneDeep, orderBy } from 'lodash';
import { defineStore } from 'pinia';

import { useSocket } from '~/composables/use-socket.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';

export const useBoardsStore = defineStore('boards-store', () => {
  const { listen } = useSocket();
  const toast = useToast();
  const route = useRoute();

  const snapshot = ref<TBoardBase[] | null>(null);

  const currentBoardId = computed(() => Number(route.params.id));

  const {
    call: fetchBoards,
    data: boards,
    isLoading: isLoadingBoards,
  } = useTryCatchFinally<TBoardBase[], undefined>({
    callback: async () => await $fetch<TBoardBase[]>('/api/boards', { method: 'GET' }),
  });

  const addNewBoard = (newBoard: TBoardBase): void => {
    if (!newBoard || !boards.value) return;
    boards.value.push(newBoard);
  };

  const updateBoard = (updatedBoard: TBoardBase) => {
    if (!updatedBoard || !boards.value?.length) return;
    replaceBoard(updatedBoard);
  };

  const deleteBoard = ({ deletedBoardId }: TDeleteBoardEmitPayload) => {
    if (!deletedBoardId || !boards.value?.length) return;
    if (deletedBoardId === currentBoardId.value) navigateTo(`/boards`);
    boards.value = boards.value.filter(({ id }: TBoardBase) => id !== deletedBoardId);
  };

  const moveBoard = async (moveResult: TMoveBoardEmitPayload) => {
    if (!boards.value?.length) return;

    // если не передан объект перемещенной доски, значит был reorder всех досок и нужно сделать refetch
    if (!moveResult.movedBoard) {
      await fetchBoards(undefined, false);
      return;
    }
    replaceBoard(moveResult.movedBoard);

    boards.value = orderBy(boards.value, ['order'], 'asc');
  };

  const stopListenCreated = listen(EBoardEvent.CREATED, (newBoard: TBoardBase) => {
    if (!newBoard.id || !boards.value) return;

    addNewBoard(newBoard);

    toast.info({ message: `Добавлена новая доска «${newBoard.title}»` });
  });

  const stopListenUpdated = listen(EBoardEvent.UPDATED, (updatedBoard: TBoardBase) => {
    if (!updatedBoard.id || !boards.value?.length) return;

    updateBoard(updatedBoard);

    toast.info({ message: `Обновлена доска «${updatedBoard.title}»` });
  });

  const stopListenDeleted = listen(EBoardEvent.DELETED, (payload: TDeleteBoardEmitPayload) => {
    if (!payload.deletedBoardId || !boards.value?.length) return;

    deleteBoard(payload);

    const deletedBoard = boards.value.find(({ id }) => id === payload.deletedBoardId);
    if (payload.deletedBoardId === currentBoardId.value)
      toast.info({ message: 'Активная доска была удалена и больше недоступна' });
    else
      toast.info({
        message: deletedBoard ? `Доска «${deletedBoard.title}» была удалена` : 'Доска была удалена',
      });
  });

  const stopListenMove = listen(EBoardEvent.MOVED, async (payload: TMoveBoardEmitPayload) => {
    if (!payload.movedBoardId || !boards.value?.length) return;

    await moveBoard(payload);

    const movedBoard = boards.value.find(({ id }: TBoardBase) => id === payload.movedBoardId);
    toast.info({
      message: movedBoard ? `Доска «${movedBoard.title}» была перемещена` : 'Доска была перемещена',
    });
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
    deleteSnapshot();
  };

  const takeSnapshot = () => {
    if (!boards.value?.length) return;
    snapshot.value = cloneDeep(boards.value.map(elem => toRaw(elem)));
  };

  const deleteSnapshot = () => {
    snapshot.value = null;
  };

  const replaceBoard = (board: TBoardBase) => {
    if (!board || !boards.value?.length) return;
    const targetIndex = boards.value.findIndex(({ id }: TBoardBase) => id === board.id);
    if (targetIndex != -1) boards.value.splice(targetIndex, 1, board);
  };

  return {
    boards,
    isLoadingBoards,
    snapshot,
    fetchBoards,
    addNewBoard,
    updateBoard,
    deleteBoard,
    moveBoard,
    stopListen,
    resetStore,
    takeSnapshot,
    deleteSnapshot,
  };
});
