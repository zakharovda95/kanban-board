import type { TAuthMeResponse, TUser } from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

export const useAuthStore = defineStore('auth-store', () => {
  const { $api } = useNuxtApp();

  const isInitialized = ref(false);

  const {
    data: me,
    isLoading: isLoadingMe,
    call: fetchMe,
  } = useTryCatchFinally<TUser | null>({
    callback: async () => {
      const result = await $api<TAuthMeResponse>('/api/auth/me', { method: 'GET' });
      return result?.data ?? null;
    },
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

  return { me, isLoadingMe, isInitialized, isAuth, fetchMe, tryInitialize, resetStore };
});
