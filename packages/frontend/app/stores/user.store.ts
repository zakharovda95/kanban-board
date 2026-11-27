import type { TPermissions, TUser } from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

export const useUserStore = defineStore('user-store', () => {
  const { $api } = useNuxtApp();

  const isInitialized = ref(false);

  const {
    data: me,
    isLoading: isLoadingMe,
    call: fetchMeRequest,
  } = useTryCatchFinally<TUser | null>({
    callback: async () => await $api<TUser | null>('/api/users/me', { method: 'GET' }),
  });

  const {
    data: permissions,
    isLoading: isLoadingPermissions,
    call: fetchPermissionsRequest,
  } = useTryCatchFinally<TPermissions>({
    callback: async () => await $api<TPermissions>('/api/users/me/permissions', { method: 'GET' }),
  });

  const isAuth = computed(() => Boolean(me.value));
  const isOwner = computed(() => me.value?.workspaceRole === 'OWNER');

  const fetchMe = async () => {
    await fetchMeRequest();

    if (!me.value || isOwner.value) {
      permissions.value = null;
      return;
    }

    await fetchPermissionsRequest();
  };

  const tryInitialize = async () => {
    if (isInitialized.value) return;
    await fetchMe();
    isInitialized.value = true;
  };

  const resetStore = () => {
    me.value = null;
    permissions.value = null;
    isLoadingMe.value = false;
    isLoadingPermissions.value = false;
    isInitialized.value = false;
  };

  return {
    me,
    permissions,
    isLoadingMe,
    isLoadingPermissions,
    isInitialized,
    isAuth,
    isOwner,
    fetchMe,
    tryInitialize,
    resetStore,
  };
});
