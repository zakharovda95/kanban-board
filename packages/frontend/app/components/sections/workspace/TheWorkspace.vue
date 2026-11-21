<template>
  <div class="size-full">
    <UIButton :disabled="isLoadingWorkspace" full prepend-icon="mingcute:settings-2-line" @click:button="openModal()">
      Настроить пространство
    </UIButton>

    <UIModal
      v-if="workspace"
      v-model:is-open="isModalOpen"
      title="Мое пространство"
      body-class="w-full laptop:w-320!"
      close-on-overlay
    >
      <div class="flex w-full flex-col gap-12">
        <div class="flex">
          <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800">
            создано {{ DatetimeUtility.format(workspace.createdAt, 'DD.MM.YYYY HH:mm') }}
          </UIBadge>
        </div>

        <UIButton
          :background-color="EColor.RED"
          full
          prepend-icon="mingcute:delete-2-line"
          @click:button="isConfirmModalOpen = true"
        >
          Удалить пространство
        </UIButton>

        <UIDivider variant="dashed" />

        <WorkspaceInvites :invites="workspace.invites" @refresh="fetchWorkspace()" />

        <UIDivider variant="dashed" />

        <WorkspaceUsers :users="workspace.users" @refresh="fetchWorkspace()" />
      </div>
    </UIModal>

    <UIConfirmationModal
      v-model:is-open="isConfirmModalOpen"
      title="Удалить рабочее пространство?"
      text="Вы собираетесь удалить <b>ВСЕ</b> данные, включая добавленных пользователей, созданные задачи и Ваш собственный аккаунт.<br>Отменить это действие будет невозможно!"
      action-button-label="Да, удалить рабочее пространство"
      :disabled="isLoadingDeleteWorkspace"
      @click:confirm="deleteWorkspace()"
      @click:reset="isConfirmModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { DatetimeUtility, EColor, getErrorMessage, type TSuccessResponse, type TWorkspace } from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import { useUserStore } from '~/stores/user.store.ts';

import WorkspaceInvites from '~/components/sections/workspace/WorkspaceInvites.vue';
import WorkspaceUsers from '~/components/sections/workspace/WorkspaceUsers.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';
import UIBadge from '~/components/ui/UIBadge.vue';
import UIDivider from '~/components/ui/UIDivider.vue';

const { $api } = useNuxtApp();
const toast = useToast();
const userStore = useUserStore();
const router = useRouter();

const isModalOpen = ref(false);
const isConfirmModalOpen = ref(false);

const openModal = async () => {
  await fetchWorkspace();
  if (!workspace.value) return;
  isModalOpen.value = true;
};

const {
  data: workspace,
  isLoading: isLoadingWorkspace,
  call: fetchWorkspace,
} = useTryCatchFinally({
  callback: async (_, signal?: AbortSignal) => await $api<TWorkspace>('/api/workspaces', { method: 'GET', signal }),
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});

const { call: deleteWorkspace, isLoading: isLoadingDeleteWorkspace } = useTryCatchFinally({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api<TSuccessResponse>('/api/workspaces', { method: 'DELETE', signal });
    if (result.isSuccess) {
      toast.success({ message: 'Рабочее пространство удалено!' });
      userStore.resetStore();
      router.push('/auth/login');
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
