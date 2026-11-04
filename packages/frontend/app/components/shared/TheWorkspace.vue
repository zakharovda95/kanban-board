<template>
  <div class="size-full">
    <UIButton :disabled="isLoadingWorkspace" full @click:button="openModal()">Настроить пространство</UIButton>

    <UIModal v-model:is-open="isModalOpen" close-on-overlay title="Мое пространство" body-class="w-full laptop:w-320!">
      <div class="flex w-full flex-col gap-12">
        <div v-if="workspace?.users && userStore.me" class="flex w-full flex-col gap-8">
          <span class="text-14">
            Пользователи
            <span class="font-semibold" :class="isMaxUsersCount ? 'text-red' : 'text-green'">
              {{ workspace.users.length }} / {{ WORKSPACE_USERS_MAX_COUNT }}
            </span>
          </span>
          <div class="flex flex-col gap-12">
            <TheProfile v-for="user in workspace.users" :key="user.id" :user="user" />
            <div class="flex gap-8">
              <UIButton prepend-icon="mingcute:add-line" full :disabled="isMaxUsersCount">
                Добавить пользователя
              </UIButton>
              <UITooltip v-if="isMaxUsersCount" :text="WORKSPACE_USERS_MAX_COUNT_ERROR_MESSAGE" size="large" />
            </div>
          </div>
        </div>

        <UIDivider variant="dashed" />

        <UIButton :background-color="EColor.RED" full @click:button="isConfirmModalOpen = true">
          Удалить рабочее пространство
        </UIButton>
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
import {
  EColor,
  getErrorMessage,
  type TSuccessResponse,
  type TWorkspace,
  WORKSPACE_USERS_MAX_COUNT,
  WORKSPACE_USERS_MAX_COUNT_ERROR_MESSAGE,
} from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import { useUserStore } from '~/stores/user.store.ts';

import TheProfile from '~/components/shared/TheProfile.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';
import UIDivider from '~/components/ui/UIDivider.vue';
import UITooltip from '~/components/ui/UITooltip.vue';

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

const isMaxUsersCount = computed(() => workspace.value?.users?.length === WORKSPACE_USERS_MAX_COUNT);

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
      router.push('/auth?view=login');
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
