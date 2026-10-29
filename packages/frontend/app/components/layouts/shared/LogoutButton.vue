<template>
  <UIButton
    tag="span"
    size="medium"
    prepend-icon="mingcute:entrance-fill"
    :full="full"
    :background-color="EColor.BLUE"
    @click:button="logout()"
  >
    Выйти
  </UIButton>
</template>

<script setup lang="ts">
import { EColor, getErrorMessage, type TSuccessResponse } from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

import UIButton from '~/components/ui/buttons/UIButton.vue';

const { full = false } = defineProps<{ full?: boolean }>();

const { $api } = useNuxtApp();
const toast = useToast();

const { call: logout } = useTryCatchFinally<undefined, null>({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api<TSuccessResponse>('/api/auth/logout', { method: 'POST', signal });
    if (result.isSuccess) {
      toast.success({ message: 'До скорого!' });
      navigateTo('/auth');
    }

    return null;
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
  useAbort: true,
});
</script>
