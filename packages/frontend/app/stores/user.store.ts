import type { TUser } from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

export const useUserStore = defineStore('user-store', () => {
  const { $api } = useNuxtApp();

  const isInitialized = ref(false);

  const {
    data: me,
    isLoading: isLoadingMe,
    call: fetchMe,
  } = useTryCatchFinally<TUser | null>({
    callback: async () => await $api<TUser | null>('/api/users/me', { method: 'GET' }),
  });

  const isAuth = computed(() => Boolean(me.value));

  const tryInitialize = async () => {
    if (isInitialized.value) return;
    await fetchMe();
    isInitialized.value = true;
  };

  const resetStore = () => {
    me.value = null;
    isLoadingMe.value = false;
    isInitialized.value = false;
  };

  return {
    me,
    isLoadingMe,
    isInitialized,
    isAuth,
    fetchMe,
    tryInitialize,
    resetStore,
  };
});
