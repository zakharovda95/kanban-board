<template>
  <UserCard :user="user" @card:click="openModal()" />

  <UIModal
    v-if="userDetails"
    v-model:is-open="isModalOpen"
    title="Профиль пользователя"
    body-class="w-full laptop:w-320!"
  >
    <div class="flex w-full flex-col gap-12" @click.stop>
      <UserInfo :user="userDetails.user" />
      <UIButton
        full
        prepend-icon="mingcute:delete-2-line"
        :background-color="EColor.RED"
        @click:button.stop="isConfirmationOpen = true"
      >
        Удалить пользователя
      </UIButton>

      <UIConfirmationModal
        v-model:is-open="isConfirmationOpen"
        title="Удалить пользователя?"
        text="Все данные пользователя будут удалены. <br> Отменить это действие будет невозможно!"
        :disabled="isDeleting"
        @click:confirm="deleteUser"
        @click:reset="isConfirmationOpen = false"
      />

      <UIDivider variant="dashed" />

      <UserBadges :user="userDetails.user" />

      <template v-if="userDetails.permissions">
        <UIDivider variant="dashed" />

        <ThePermissions v-model:permissions="userDetails.permissions" :user-id="userDetails.user.id" />
      </template>
    </div>
  </UIModal>
</template>

<script setup lang="ts">
import {
  EColor,
  EUserWorkspaceRole,
  getErrorMessage,
  type TPermissions,
  type TUser,
  type TUserBase,
} from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

import ThePermissions from '~/components/sections/permissions/ThePermissions.vue';
import UserBadges from '~/components/sections/user/UserBadges.vue';
import UserCard from '~/components/sections/user/UserCard.vue';
import UserInfo from '~/components/sections/user/UserInfo.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';

const props = defineProps<{
  user: TUserBase;
}>();

const emit = defineEmits<{
  'refresh': [];
}>();

const { $api } = useNuxtApp();
const toast = useToast();

const isModalOpen = ref(false);
const isConfirmationOpen = ref(false);

const openModal = async () => {
  isModalOpen.value = true;
  await fetchUserDetails();
};

const closeModals = () => {
  isConfirmationOpen.value = false;
  isModalOpen.value = false;
};

const { call: fetchUserDetails, data: userDetails } = useTryCatchFinally<{
  user: TUser;
  permissions: TPermissions | null;
}>({
  callback: async (_, signal?: AbortSignal) => {
    const user = await $api<TUser>(`/api/users/${props.user.id}`, { method: 'GET', signal });

    if (user.workspaceRole === EUserWorkspaceRole.OWNER) return { user, permissions: null };

    const permissions = await $api<TPermissions>(`/api/users/${props.user.id}/permissions`, {
      method: 'GET',
      signal,
    });

    return { user, permissions };
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
    closeModals();
  },
  useAbort: true,
});

const { call: deleteUser, isLoading: isDeleting } = useTryCatchFinally({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api(`/api/users/${props.user.id}`, { method: 'DELETE', signal });
    if (result.isSuccess) {
      toast.success({ message: 'Пользователь удален!' });
      closeModals();
      emit('refresh');
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
