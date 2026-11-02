import type { TUser, TUserWorkspace } from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

export const useUserStore = defineStore('user-store', () => {
  const { $api } = useNuxtApp();

  const isInitialized = ref(false);

  const {
    data,
    isLoading: isLoadingMe,
    call: fetchMe,
  } = useTryCatchFinally<{ user: TUser; workspace: TUserWorkspace | null }>({
    callback: async () => {
      const userResult = await $api<TUser | null>('/api/users/me', { method: 'GET' });
      if (!userResult) return null;

      const workspaceResult = await $api<TUserWorkspace | null>('/api/users/me/workspaces', { method: 'GET' });
      return {
        user: userResult,
        workspace: workspaceResult,
      };
    },
  });

  const isAuth = computed(() => Boolean(data.value));

  const me = computed({
    get: () => data.value?.user ?? null,
    set: value => {
      if (!data.value?.user || !value) return;
      data.value.user = value;
    },
  });

  const workspace = computed(() => data.value?.workspace ?? null);

  const tryInitialize = async () => {
    if (isInitialized.value) return;
    await fetchMe();
    isInitialized.value = true;
  };

  const resetStore = () => {
    data.value = null;
    isLoadingMe.value = false;
    isInitialized.value = false;
  };

  return { me, workspace, isLoadingMe, isInitialized, isAuth, fetchMe, tryInitialize, resetStore };
});
