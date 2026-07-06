import { useBoardsStore } from '~/stores/boards.store';

export default defineNuxtRouteMiddleware((to, _) => {
  const boardsStore = useBoardsStore();
  const firstBoardId = boardsStore.boards?.[0]?.id;

  if (to.name === 'index' || to.name === 'boards') {
    return firstBoardId ? abortNavigation() : navigateTo(`/boards/${firstBoardId}`);
  }
});
