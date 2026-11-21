<template>
  <UserCard :user="user" @card:click="openModal()" />

  <UIModal v-model:is-open="isModalOpen" body-class="w-full laptop:w-320!" close-on-overlay>
    <div class="flex w-full flex-col gap-12" @click.stop>
      <UILoader v-if="isLoadingUser || !fullUser" full />

      <template v-else>
        <UserInfo :user="fullUser" />
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

        <UserBadges :user="fullUser" />

        <template v-if="fullUser.permissions">
          <UIDivider variant="dashed" />

          <UserPermissions />
        </template>
      </template>
    </div>
  </UIModal>
</template>

<script setup lang="ts">
import { EColor, getErrorMessage, type TUser, type TUserBase } from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

import UserBadges from '~/components/sections/user/UserBadges.vue';
import UserCard from '~/components/sections/user/UserCard.vue';
import UserInfo from '~/components/sections/user/UserInfo.vue';
import UserPermissions from '~/components/sections/user/UserPermissions.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UILoader from '~/components/ui/loaders/UILoader.vue';
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
  await fetchUser();
};

const closeModals = () => {
  isConfirmationOpen.value = false;
  isModalOpen.value = false;
};

const {
  call: fetchUser,
  data: fullUser,
  isLoading: isLoadingUser,
} = useTryCatchFinally({
  callback: async (_, signal?: AbortSignal) => {
    return await $api<TUser>(`/api/users/${props.user.id}`, { method: 'GET', signal });
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
