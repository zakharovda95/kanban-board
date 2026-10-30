<template>
  <div class="bg-light-base rounded-12 w-full p-12">
    <UIForm
      title="Войти"
      full
      buttons-size="large"
      buttons-position="row"
      action-button-label="Войти"
      hide-reject-button
      :disabled="isLoading"
      @submit:form="call"
    >
      <div class="flex w-full flex-col gap-16">
        <UILabel text="Логин" size="medium" required>
          <UIInput
            name="auth-login"
            :model-value="formData.login"
            full
            size="large"
            placeholder="Укажите логин"
            autocomplete="username"
            :max-length="AUTH_LOGIN_MAXLENGTH"
            :errors="formErrors.login"
            @update:model-value="update('login', $event)"
          />
        </UILabel>
        <UILabel text="Пароль" size="medium" required>
          <UIInput
            name="auth-login"
            :model-value="formData.password"
            full
            size="large"
            type="password"
            placeholder="Укажите пароль"
            autocomplete="current-password"
            :max-length="AUTH_PASSWORD_MAXLENGTH"
            :errors="formErrors.password"
            @update:model-value="update('password', $event)"
          />
        </UILabel>
      </div>
    </UIForm>
  </div>
  <UIButton
    append-icon="mingcute:user-add-2-fill"
    :background-color="EColor.BLUE"
    @click:button="emit('update:tab', 'register')"
  >
    Я хочу создать аккаунт
  </UIButton>
</template>

<script setup lang="ts">
import {
  AUTH_LOGIN_MAXLENGTH,
  AUTH_PASSWORD_MAXLENGTH,
  EColor,
  getErrorMessage,
  isValidationError,
  type TAuthLoginBodySchema,
  type TSuccessResponse,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import { useAuthStore } from '~/stores/auth.store.ts';
import type { TAuthTab } from '~/types/auth.types.ts';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIForm from '~/components/ui/UIForm.vue';
import UILabel from '~/components/ui/UILabel.vue';

const emit = defineEmits<{
  'update:tab': [tab: TAuthTab];
}>();

const { $api } = useNuxtApp();
const toast = useToast();

const authStore = useAuthStore();

const { formData, formErrors, update } = useForm<TAuthLoginBodySchema>({ login: '', password: '' });

const { call, isLoading } = useTryCatchFinally<null>({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api<TSuccessResponse>('/api/auth/login', {
      method: 'POST',
      body: formData.value,
      signal,
    });

    if (result.isSuccess) {
      toast.success({ message: 'Добро пожаловать!' });
      await authStore.fetchMe();
      navigateTo('/boards');
    }

    return null;
  },
  catchCallback: (error: unknown) => {
    if (isValidationError(error)) formErrors.value = error.validation;
    else toast.error({ message: getErrorMessage(error) });
  },
  callOnInit: false,
  useAbort: true,
});
</script>
