<template>
  <UserCard :user="user" @card:click="isModalOpen = true" />

  <UIModal v-model:is-open="isModalOpen" title="Мой профиль" body-class="w-full laptop:w-320!">
    <div class="flex w-full flex-col gap-12" @click.stop>
      <UIForm
        full
        :disabled="!hasChanges || isLoading"
        hide-reject-button
        action-button-label="Сохранить изменения"
        @submit:form="updateProfile()"
      >
        <TheAvatar v-model:avatar="formData.avatar" size="large" can-update-avatar full />

        <UserNameForm :form-data="formData" size="medium" button-class="scale-90" />

        <UILabel text="Логин">
          <UIInput name="login-input" :model-value="user.login" full readonly />
        </UILabel>
      </UIForm>

      <UIDivider variant="dashed" />

      <UserBadges :user="user" />

      <UIDivider variant="dashed" />

      <UIButton
        full
        :background-color="EColor.RED"
        prepend-icon="mingcute:delete-2-line"
        @click:button.stop="isConfirmationOpen = true"
      >
        Удалить профиль
      </UIButton>

      <UIConfirmationModal
        v-model:is-open="isConfirmationOpen"
        title="Удалить профиль?"
        text="Все ваши данные будут удалены. <br> Отменить это действие будет невозможно!"
        :disabled="isDeleting"
        @click:confirm="deleteProfile"
        @click:reset="isConfirmationOpen = false"
      />
    </div>
  </UIModal>
</template>

<script setup lang="ts">
import {
  EColor,
  getErrorMessage,
  type TSuccessResponse,
  type TUpdateUserResponse,
  type TUser,
} from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import type { TUserProfileFormData } from '~/types/user.types.ts';

import UserBadges from '~/components/sections/user/UserBadges.vue';
import UserCard from '~/components/sections/user/UserCard.vue';
import TheAvatar from '~/components/shared/TheAvatar.vue';
import UserNameForm from '~/components/shared/UserNameForm.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';
import UIForm from '~/components/ui/UIForm.vue';
import UILabel from '~/components/ui/UILabel.vue';

const user = defineModel<TUser>('user', { required: true });

const emit = defineEmits<{
  'profile:deleted': [];
}>();

const { $api } = useNuxtApp();
const toast = useToast();

const isModalOpen = ref(false);
const isConfirmationOpen = ref(false);

const closeModal = () => {
  isConfirmationOpen.value = false;
  isModalOpen.value = false;
};

const formData = reactive<TUserProfileFormData>({
  avatar: user.value.avatar ?? null,
  firstName: user.value.firstName ?? '',
  lastName: user.value.lastName ?? '',
});

const hasChanges = computed(() => {
  return (
    formData.avatar !== user.value.avatar ||
    formData.firstName !== user.value.firstName ||
    formData.lastName !== user.value.lastName
  );
});

const { call: updateProfile, isLoading } = useTryCatchFinally({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api<TUpdateUserResponse>('/api/users/me', { body: formData, method: 'PATCH', signal });

    if (result.isSuccess && result.data) {
      user.value = Object.assign(user.value, result.data);
      toast.success({ message: 'Профиль обновлен!' });
      closeModal();
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});

const { call: deleteProfile, isLoading: isDeleting } = useTryCatchFinally({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api<TSuccessResponse>('/api/users/me', { method: 'DELETE', signal });

    if (result.isSuccess) {
      toast.success({ message: 'Профиль удален!' });
      closeModal();
      emit('profile:deleted');
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
