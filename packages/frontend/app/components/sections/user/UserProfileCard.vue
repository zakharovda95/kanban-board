<template>
  <UserCard :user="user">
    <UserInfo :user="user" />
    <UIButton
      full
      prepend-icon="mingcute:delete-2-line"
      :background-color="EColor.RED"
      @click:button.stop="isModalOpen = true"
    >
      Удалить пользователя
    </UIButton>

    <UIConfirmationModal
      v-model:is-open="isModalOpen"
      title="Удалить пользователя?"
      text="Все данные пользователя будут удалены. <br> Отменить это действие будет невозможно!"
      :disabled="isLoading"
      @click:confirm="deleteUser"
      @click:reset="isModalOpen = false"
    />

    <UIDivider variant="dashed" />

    <UserBadges :user="user" />

    <UIDivider variant="dashed" />

    <UserPermissions />
  </UserCard>
</template>

<script setup lang="ts">
import { EColor, getErrorMessage, type TUser } from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

import UserBadges from '~/components/sections/user/UserBadges.vue';
import UserCard from '~/components/sections/user/UserCard.vue';
import UserInfo from '~/components/sections/user/UserInfo.vue';
import UserPermissions from '~/components/sections/user/UserPermissions.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';

const props = defineProps<{
  user: TUser;
}>();

const emit = defineEmits<{
  'refresh': [];
}>();

const { $api } = useNuxtApp();
const toast = useToast();

const isModalOpen = ref(false);

const { call: deleteUser, isLoading } = useTryCatchFinally({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api(`/api/users/${props.user.id}`, { method: 'DELETE', signal });
    if (result.isSuccess) {
      toast.success({ message: 'Пользователь удален!' });
      isModalOpen.value = false;
      emit('refresh');
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
