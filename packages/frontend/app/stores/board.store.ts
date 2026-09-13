import {
  EBoardEvent,
  EColumnEvent,
  EIssueEvent,
  type TBoard,
  type TColumn,
  type TColumnBase,
  type TDeleteColumnEmitPayload,
  type TDeleteIssueEmitPayload,
  type TIssueBase,
  type TMoveColumnEmitPayload,
  type TMoveIssueEmitPayload,
} from '@kanban-board/common';
import { cloneDeep, orderBy } from 'lodash';
import { defineStore } from 'pinia';

import { useSocket } from '~/composables/use-socket.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';

export const useBoardStore = defineStore('board-store', () => {
  const { listen, $socket } = useSocket();
  const toast = useToast();

  const snapshot = ref<TColumn[] | null>(null);

  const {
    call: fetchBoard,
    isLoading: isLoadingBoard,
    data: board,
  } = useTryCatchFinally({
    callback: async (boardId: number = 0, signal?: AbortSignal) => {
      if (!boardId || boardId <= 0) throw new Error('Не передан boardId');
      return await $fetch<TBoard>(`/api/boards/${boardId}`, { method: 'GET', signal });
    },
    useAbort: true,
  });

  const joinBoard = (boardId: number) => {
    if (!boardId || boardId <= 0) return;
    $socket?.emit(EBoardEvent.JOIN, boardId);
  };

  const leaveBoard = (boardId: number) => {
    if (!boardId || boardId <= 0) return;
    $socket?.emit(EBoardEvent.LEAVE, boardId);
  };

  const addColumn = (column: TColumn) => {
    if (!column || !board.value) return;
    board.value.columns.push(column);
  };

  const updateColumn = (columnBase: TColumnBase) => {
    if (!columnBase || !board.value) return;

    const targetIndex = board.value.columns.findIndex(({ id }: TColumn) => id === columnBase.id);
    if (targetIndex === -1) return;

    const existingColumn = board.value.columns[targetIndex];
    if (!existingColumn) return;

    // По сети приходит только базовый объект колонки, задачи берем локально из существующей.
    const issues = existingColumn.issues;
    board.value.columns.splice(targetIndex, 1, { ...columnBase, issues });
  };

  const deleteColumn = (payload: TDeleteColumnEmitPayload) => {
    if (!payload || !board.value) return;
    board.value.columns = board.value.columns.filter(({ id }) => id !== payload.deletedColumnId);
  };

  const moveColumn = async (moveResult: TMoveColumnEmitPayload) => {
    if (!moveResult || !board.value) return;

    // если не передан объект перемещенной колонки, значит был reorder всех колонок и нужно сделать refetch
    if (!moveResult.movedColumn) {
      await fetchBoard(moveResult.boardId, false);
      return;
    }

    updateColumn(moveResult.movedColumn);

    board.value.columns = orderBy(board.value.columns, ['order'], 'asc');
  };

  const addIssue = (issue: TIssueBase) => {
    if (!issue || !board.value) return;

    const targetColumn = board.value.columns.find(({ id }) => id === issue.columnId);
    if (targetColumn) targetColumn.issues.push(issue);
  };

  const updateIssue = (issue: TIssueBase) => {
    if (!issue || !board.value) return;

    const targetColumn = board.value.columns.find(({ id }) => id === issue.columnId);
    if (!targetColumn) return;

    const targetIndex = targetColumn.issues.findIndex(({ id }) => id === issue.id);
    if (targetIndex != -1) targetColumn.issues.splice(targetIndex, 1, issue);
  };

  const deleteIssue = (payload: TDeleteIssueEmitPayload) => {
    if (!payload || !board.value) return;

    const targetColumn = board.value.columns.find(({ id }) => id === payload.columnId);
    if (targetColumn) targetColumn.issues = targetColumn.issues.filter(({ id }) => id !== payload.deletedIssueId);
  };

  const moveIssue = async (moveResult: TMoveIssueEmitPayload) => {
    if (!moveResult || !board.value) return;

    // если не передан объект перемещенной задачи, значит был reorder и нужно сделать refetch
    if (!moveResult.movedIssue) {
      await fetchBoard(moveResult.boardId, false);
      return;
    }

    const { columnIdFrom, columnIdTo, movedIssue } = moveResult;

    // если перемещение было в другую колонку - удаляем из текущей колонки перемещенную задачу
    if (columnIdFrom !== columnIdTo) {
      deleteIssue({ boardId: moveResult.boardId, columnId: columnIdFrom, deletedIssueId: movedIssue.id });
    }

    const toColumn = board.value.columns.find(({ id }) => id === columnIdTo);
    if (!toColumn) return;

    // вставляем перемещенную задачу в целевую колонку, сортируем по order
    const targetIndex = toColumn.issues.findIndex(({ id }) => id === movedIssue.id);
    if (targetIndex !== -1) toColumn.issues.splice(targetIndex, 1, movedIssue);
    else toColumn.issues.push(movedIssue);

    toColumn.issues = orderBy(toColumn.issues, ['order'], 'asc');
  };

  const takeSnapshot = () => {
    if (!board.value) return;
    snapshot.value = cloneDeep(toRaw(board.value.columns));
  };

  const deleteSnapshot = () => {
    snapshot.value = null;
  };

  const restoreSnapshot = () => {
    if (!snapshot.value || !board.value) return;
    board.value.columns = snapshot.value;
    deleteSnapshot();
  };

  const stopListenColumnCreated = listen(EColumnEvent.CREATED, (column: TColumn) => {
    if (!board.value) return;

    addColumn(column);

    toast.info({ message: `Добавлена новая колонка «${column.title}»` });
  });

  const stopListenColumnUpdated = listen(EColumnEvent.UPDATED, (column: TColumnBase) => {
    if (!board.value) return;

    updateColumn(column);

    toast.info({ message: `Обновлена колонка «${column.title}»` });
  });

  const stopListenColumnDeleted = listen(EColumnEvent.DELETED, (payload: TDeleteColumnEmitPayload) => {
    if (!board.value) return;

    deleteColumn(payload);

    const deletedColumn = board.value?.columns.find(({ id }) => id === payload.deletedColumnId);
    toast.info({
      message: deletedColumn ? `Колонка «${deletedColumn.title}» была удалена` : 'Колонка была удалена',
    });
  });

  const stopListenColumnMoved = listen(EColumnEvent.MOVED, async (payload: TMoveColumnEmitPayload) => {
    if (!payload.movedColumnId || !board.value) return;

    await moveColumn(payload);

    const movedColumn = board.value.columns.find(({ id }: TColumn) => id === payload.movedColumnId);
    toast.info({
      message: movedColumn ? `Колонка «${movedColumn.title}» была перемещена` : 'Колонка была перемещена',
    });
  });

  const stopListenIssueCreated = listen(EIssueEvent.CREATED, (issue: TIssueBase) => {
    if (!board.value) return;

    addIssue(issue);

    toast.info({ message: `Добавлена новая задача «${issue.title}»` });
  });

  const stopListenIssueUpdated = listen(EIssueEvent.UPDATED, (issue: TIssueBase) => {
    if (!board.value) return;

    updateIssue(issue);

    toast.info({ message: `Обновлена задача «${issue.title}»` });
  });

  const stopListenIssueDeleted = listen(EIssueEvent.DELETED, (payload: TDeleteIssueEmitPayload) => {
    if (!board.value) return;

    const deletedIssue = board.value.columns
      .flatMap(column => column.issues)
      .find(({ id }) => id === payload.deletedIssueId);

    deleteIssue(payload);

    toast.info({
      message: deletedIssue ? `Задача «${deletedIssue.title}» была удалена` : 'Задача была удалена',
    });
  });

  const stopListenIssueMoved = listen(EIssueEvent.MOVED, async (payload: TMoveIssueEmitPayload) => {
    if (!payload.movedIssueId || !board.value) return;

    await moveIssue(payload);

    const movedIssue = board.value?.columns
      ?.flatMap(column => column.issues)
      .find(({ id }) => id === payload.movedIssueId);

    toast.info({
      message: movedIssue ? `Задача «${movedIssue.title}» была перемещена` : 'Задача была перемещена',
    });
  });

  const stopListen = () => {
    stopListenColumnCreated();
    stopListenColumnUpdated();
    stopListenColumnDeleted();
    stopListenColumnMoved();

    stopListenIssueCreated();
    stopListenIssueUpdated();
    stopListenIssueDeleted();
    stopListenIssueMoved();
  };

  const resetStore = (hard: boolean = false) => {
    snapshot.value = null;
    if (hard) {
      isLoadingBoard.value = false;
      board.value = null;
    }
  };

  return {
    isLoadingBoard,
    board,
    snapshot,
    fetchBoard,
    joinBoard,
    leaveBoard,
    addColumn,
    updateColumn,
    deleteColumn,
    moveColumn,
    addIssue,
    updateIssue,
    deleteIssue,
    moveIssue,
    takeSnapshot,
    deleteSnapshot,
    restoreSnapshot,
    stopListen,
    resetStore,
  };
});
