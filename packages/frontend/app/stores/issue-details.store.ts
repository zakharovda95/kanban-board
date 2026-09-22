import {
  EIssueEvent,
  getErrorMessage,
  type TDeleteIssueEmitPayload,
  type TIssue,
  type TIssueBase,
  type TMoveIssue,
  type TMoveIssueEmitPayload,
  type TMoveIssueResponse,
} from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useSocket } from '~/composables/use-socket.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import { useBoardStore } from '~/stores/board.store.ts';
import type { TUISelectOption } from '~/types/ui.types.ts';

export const useIssueDetailsStore = defineStore('issue-detail-store', () => {
  const boardStore = useBoardStore();

  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  const { emitEvent, listen, isLoading: isLoadingSocket } = useSocket();

  const stages = computed<TUISelectOption[]>(
    () => boardStore.board?.columns.map(({ id, title }) => ({ id, label: title })) ?? [],
  );

  const issueIdFromQuery = computed(() => {
    if (!route.query?.issue) return null;
    const queryId = String(route.query.issue).split('-')?.[1];
    if (!queryId) return null;
    return Number(queryId);
  });

  const selectedIssueId = ref<number | null>(issueIdFromQuery.value);
  const isModalOpen = ref(Boolean(issueIdFromQuery.value));

  const {
    data: issueDetails,
    isLoading: isLoadingIssueDetails,
    call: fetchIssueDetails,
  } = useTryCatchFinally({
    callback: async () => {
      if (!selectedIssueId.value) return null;
      return $fetch<TIssue>(`/api/issues/${selectedIssueId.value}`, { method: 'GET' });
    },
    catchCallback: (error: unknown) => toast.error({ message: getErrorMessage(error) }),
    callOnInit: Boolean(issueIdFromQuery.value),
  });

  const unsubscribers: Array<() => void> = [];

  // Если у кого-то открыта детальная задачи, и в это время были внесены изменения - реактивный апдейт задачи.
  const subscribeToIssueUpdates = () => {
    stopListen();

    unsubscribers.push(
      listen(EIssueEvent.UPDATED, async (updatedIssue: TIssueBase) => {
        if (updatedIssue.id === selectedIssueId.value) await fetchIssueDetails();
      }),

      listen(EIssueEvent.MOVED, async (payload: TMoveIssueEmitPayload) => {
        if (payload.movedIssueId !== selectedIssueId.value || !issueDetails.value) return;
        await onIssueMove(payload);
      }),
    );
  };

  const openIssueDetails = async (issue: TIssueBase) => {
    if (isLoadingIssueDetails.value) return;

    selectedIssueId.value = issue.id;

    await fetchIssueDetails();
    isModalOpen.value = true;
    router.replace({ query: { ...route.query, issue: `task-${issue.id}` } });
    subscribeToIssueUpdates();
  };

  const closeIssueDetails = () => {
    isModalOpen.value = false;
    selectedIssueId.value = null;
    router.replace({ query: { ...route.query, issue: undefined } });
    stopListen();
  };

  const emitMove = (body: TMoveIssue) => {
    emitEvent<TMoveIssue, TMoveIssueResponse>({
      event: EIssueEvent.MOVE,
      data: body,
      successCallback: async (response: TMoveIssueResponse) => {
        if (response.isSuccess && response.data) {
          toast.success({ message: 'Задача перемещена' });
          await Promise.allSettled([boardStore.moveIssue(response.data), onIssueMove(response.data)]);
          boardStore.deleteSnapshot();
        }
      },
      errorCallback: (error: unknown) => {
        toast.error({ message: getErrorMessage(error) });
        boardStore.restoreSnapshot();
      },
    });
  };

  const onModalClose = (isOpen: boolean) => {
    if (isOpen) return;
    closeIssueDetails();
  };

  const onUpdateIssue = async (issue: TIssueBase) => {
    await fetchIssueDetails();
    boardStore.updateIssue(issue);
  };

  const onDeleteIssue = (payload: TDeleteIssueEmitPayload) => {
    boardStore.deleteIssue(payload);
    closeIssueDetails();
  };

  const onIssueMove = async (payload: TMoveIssueEmitPayload) => {
    if (payload.movedIssue && issueDetails.value?.id === payload.movedIssue.id) {
      issueDetails.value = { ...issueDetails.value, columnId: payload.movedIssue.columnId };
      return;
    }
    await fetchIssueDetails();
  };

  const onChangeStage = (payload: TMoveIssue) => {
    emitMove(payload);
  };

  const resetStore = () => {
    selectedIssueId.value = null;
    isModalOpen.value = false;
    isLoadingIssueDetails.value = false;
  };

  const stopListen = () => {
    while (unsubscribers.length) {
      unsubscribers.pop()?.();
    }
  };

  return {
    stages,
    issueDetails,
    issueIdFromQuery,
    selectedIssueId,
    isModalOpen,
    isLoadingIssueDetails,
    isLoadingSocket,
    fetchIssueDetails,
    openIssueDetails,
    emitMove,
    onModalClose,
    onUpdateIssue,
    onDeleteIssue,
    onChangeStage,
    subscribeToIssueUpdates,
    resetStore,
    stopListen,
  };
});
