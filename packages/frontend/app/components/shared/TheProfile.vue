<template>
  <div
    class="rounded-8 bg-light-100 hover:border-green flex size-full h-60 cursor-pointer items-center justify-start gap-24 border border-transparent p-8 duration-300 select-none"
    @click="isModalOpen = true"
  >
    <TheAvatar :avatar="user.avatar" />
    <div class="flex flex-col gap-4">
      <span class="text-14 font-medium">{{ fullName }}</span>
      <span class="text-12">
        активен до
        <span class="text-blue font-medium">
          {{ DatetimeUtility.format(user.workspace.expiresAt, 'DD.MM.YYYY') }}
        </span>
      </span>
    </div>

    <UIModal v-model:is-open="isModalOpen" title="Мой профиль" body-class="w-full laptop:w-320!" close-on-overlay>
      <div class="flex w-full flex-col gap-24">
        <div class="flex flex-col gap-8">
          <div class="flex flex-nowrap gap-8">
            <UIBadge v-if="user.status">{{ USER_STATUS_MAP[user.status] }}</UIBadge>
            <UIBadge v-if="user.workspace.workspaceRole" :background-color="EColor.BLUE">
              {{ USER_WORKSPACE_ROLE_MAP[user.workspace.workspaceRole] }}
            </UIBadge>
          </div>
          <div class="flex flex-nowrap gap-8">
            <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800">
              c {{ DatetimeUtility.format(user.workspace.createdAt, 'DD.MM.YYYY') }}
            </UIBadge>
            <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800">
              до {{ DatetimeUtility.format(user.workspace.expiresAt, 'DD.MM.YYYY') }}
            </UIBadge>
          </div>
        </div>

        <UIDivider variant="dashed" />

        <div class="flex w-full flex-col gap-12">
          <TheAvatar v-model:avatar="formData.avatar" size="large" can-edit-avatar full />
          <UserNameForm :form-data="formData" size="medium" button-class="scale-90" />
          <UIButton full :disabled="!hasChanges || isLoading" @click:button="updateProfile()">
            Сохранить изменения
          </UIButton>
        </div>
      </div>
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import {
  DatetimeUtility,
  EColor,
  getErrorMessage,
  type TUpdateUserResponse,
  type TUser,
  USER_STATUS_MAP,
  USER_WORKSPACE_ROLE_MAP,
} from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import type { TUserProfileFormData } from '~/types/user.types.ts';

import TheAvatar from '~/components/shared/TheAvatar.vue';
import UserNameForm from '~/components/shared/UserNameForm.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';

const user = defineModel<TUser>('user', { required: true });

const { $api } = useNuxtApp();
const toast = useToast();

const fullName = computed(() => `${user.value.lastName} ${user.value.firstName}`);

const isModalOpen = ref(false);

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
    const result = await $api<TUpdateUserResponse>('/api/users', { body: formData, method: 'PATCH', signal });
    if (result.isSuccess && result.data) {
      user.value = Object.assign(user.value, result.data);
      isModalOpen.value = false;
      toast.success({ message: 'Профиль обновлен!' });
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
