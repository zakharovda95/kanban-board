<template>
  <div class="size-full">
    <UIButton full @click:button="isModalOpen = true">Настроить пространство</UIButton>
    <UIModal v-model:is-open="isModalOpen" close-on-overlay title="Мое пространство" body-class="w-full laptop:w-320!">
      <UIButton :background-color="EColor.RED" full size="large" @click:button="isConfirmModalOpen = true">
        Удалить рабочее пространство
      </UIButton>
    </UIModal>
    <UIConfirmationModal
      v-model:is-open="isConfirmModalOpen"
      title="Удалить рабочее пространство?"
      text="Вы собираетесь удалить <b>ВСЕ</b> данные, включая добавленных пользователей, созданные задачи и Ваш собственный аккаунт.<br>Отменить это действие будет невозможно!"
      action-button-label="Да, удалить рабочее пространство"
      @click:confirm="deleteWorkspace()"
      @click:reset="closeModals"
    />
  </div>
</template>

<script setup lang="ts">
import { EColor, type TSuccessResponse } from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import { useUserStore } from '~/stores/user.store.ts';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';

const { $api } = useNuxtApp();
const toast = useToast();
const userStore = useUserStore();
const router = useRouter();

const isModalOpen = ref(false);
const isConfirmModalOpen = ref(false);

const closeModals = () => {
  isModalOpen.value = false;
  isConfirmModalOpen.value = false;
};

const { call: deleteWorkspace } = useTryCatchFinally({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api<TSuccessResponse>('/api/workspaces', { method: 'DELETE', signal });
    if (result.isSuccess) {
      toast.success({ message: 'Рабочее пространство удалено!' });
      userStore.resetStore();
      router.push('/auth?view=login');
    }
  },
});
</script>
