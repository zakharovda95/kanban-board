<template>
  <UIButton
    tag="span"
    size="medium"
    prepend-icon="mingcute:entrance-fill"
    :full="full"
    :background-color="EColor.BLUE"
    @click:button="isModalOpen = true"
  >
    Выйти
  </UIButton>

  <UIConfirmationModal
    v-model:is-open="isModalOpen"
    title="Уже уходите?"
    text="Выйти из системы?"
    action-button-label="Да, выйти"
    @click:confirm="logout()"
    @click:reset="isModalOpen = false"
  />
</template>

<script setup lang="ts">
import { EColor, getErrorMessage, type TSuccessResponse } from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import { useUserStore } from '~/stores/user.store.ts';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';

withDefaults(defineProps<{ full?: boolean }>(), { full: false });

const { $api } = useNuxtApp();
const toast = useToast();

const userStore = useUserStore();

const isModalOpen = ref(false);

const { call: logout } = useTryCatchFinally<undefined, null>({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api<TSuccessResponse>('/api/auth/logout', { method: 'POST', signal });
    if (result.isSuccess) {
      toast.success({ message: 'До скорого!' });
      userStore.resetStore();
      navigateTo('/auth?view=login');
    }

    return null;
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
  useAbort: true,
});
</script>
