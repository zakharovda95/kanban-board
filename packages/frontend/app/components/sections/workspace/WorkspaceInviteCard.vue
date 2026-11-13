<template>
  <div class="rounded-8 bg-light-100 flex justify-between gap-8 p-8">
    <div class="flex flex-col gap-4">
      <span class="text-14 font-semibold">{{ invite.name }}</span>
      <span class="text-12">
        Создано
        <span class="text-blue">{{ DatetimeUtility.format(invite.createdAt, 'DD.MM.YYYY HH:mm') }}</span>
      </span>
      <span class="text-12">
        Истекает
        <span class="text-blue">{{ DatetimeUtility.format(invite.expiresAt, 'DD.MM.YYYY HH:mm') }}</span>
      </span>
    </div>

    <UIIconButton
      icon="mingcute:delete-2-line"
      size="small"
      :background-color="EColor.RED"
      @click:button="isModalOpen = true"
    />

    <UIConfirmationModal
      v-model:is-open="isModalOpen"
      title="Отозвать инвайт?"
      text="Пользователь не сможет зарегистрироваться по предоставленной ранее ссылке. <br> Отозвать приглашение?"
      @click:confirm="deleteInvite()"
      @click:reset="closeModal()"
    />
  </div>
</template>

<script setup lang="ts">
import {
  DatetimeUtility,
  EColor,
  getErrorMessage,
  type TSuccessResponse,
  type TWorkspaceInvite,
} from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';

const props = defineProps<{
  invite: TWorkspaceInvite;
}>();

const emit = defineEmits<{
  'delete:invite': [];
}>();

const toast = useToast();
const { $api } = useNuxtApp();

const isModalOpen = ref(false);

const closeModal = () => {
  isModalOpen.value = false;
};

const { call: deleteInvite } = useTryCatchFinally<undefined>({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api<TSuccessResponse>(`/api/workspaces/invites/${props.invite.id}`, {
      method: 'DELETE',
      signal,
    });
    if (result.isSuccess) {
      toast.success({ message: `Инвайт «${props.invite.name}» удален!` });
      emit('delete:invite');
      closeModal();
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
