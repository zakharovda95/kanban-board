import type { TMe } from '@kanban-board/common';
import { defineStore } from 'pinia';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

export const useUserStore = defineStore('user-store', () => {
  const { $api } = useNuxtApp();

  const isInitialized = ref(false);

  const {
    data,
    isLoading: isLoadingMe,
    call: fetchMe,
  } = useTryCatchFinally<TMe | null>({
    callback: async () => await $api<TMe | null>('/api/users/me', { method: 'GET' }),
  });

  const isAuth = computed(() => Boolean(data.value));

  // Обновление данных при редактировании профиля
  const me = computed({
    get: () => data.value?.me ?? null,
    set: value => {
      if (!data.value?.me || !value) return;
      data.value.me = value;
    },
  });

  const myWorkspace = computed(() => data.value?.myWorkspace ?? null);

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

  return {
    data,
    me,
    myWorkspace,
    isLoadingMe,
    isInitialized,
    isAuth,
    fetchMe,
    tryInitialize,
    resetStore,
  };
});
