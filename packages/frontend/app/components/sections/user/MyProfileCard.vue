<template>
  <UserCard ref="profileRef" title="Мой профиль" :user="user">
    <div class="flex w-full flex-col gap-12">
      <UIForm
        full
        :disabled="!hasChanges || isLoading"
        hide-reject-button
        action-button-label="Сохранить изменения"
        @submit:form="updateProfile()"
      >
        <TheAvatar v-model:avatar="formData.avatar" size="large" can-edit-avatar full />
        <UserNameForm :form-data="formData" size="medium" button-class="scale-90" />
        <UILabel text="Логин">
          <UIInput name="login-input" :model-value="user.login" full readonly />
        </UILabel>
      </UIForm>
    </div>

    <UIDivider variant="dashed" />
    <UserBadges :user="user" />
  </UserCard>
</template>

<script setup lang="ts">
import { getErrorMessage, type TUpdateUserResponse, type TUser } from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import type { TUserProfileFormData } from '~/types/user.types.ts';

import UserBadges from '~/components/sections/user/UserBadges.vue';
import UserCard from '~/components/sections/user/UserCard.vue';
import TheAvatar from '~/components/shared/TheAvatar.vue';
import UserNameForm from '~/components/shared/UserNameForm.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIForm from '~/components/ui/UIForm.vue';
import UILabel from '~/components/ui/UILabel.vue';

const user = defineModel<TUser>('user', { required: true });

const { $api } = useNuxtApp();
const toast = useToast();

const profileRef = useTemplateRef<InstanceType<typeof UserCard> | null>('profileRef');

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
      profileRef.value?.closeModal?.();
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
