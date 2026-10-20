<template>
  <div class="bg-light-base rounded-12 w-full p-12">
    <UIForm
      title="Войти"
      full
      buttons-size="large"
      buttons-position="row"
      action-button-label="Войти"
      hide-reject-button
    >
      <div class="flex w-full flex-col gap-16">
        <UILabel text="Логин" size="medium" required>
          <UIInput
            name="auth-login"
            model-value=""
            full
            size="large"
            placeholder="Укажите логин"
            autocomplete="username"
            :max-length="AUTH_LOGIN_MAXLENGTH"
          />
        </UILabel>
        <UILabel text="Пароль" size="medium" required>
          <UIInput
            name="auth-login"
            model-value=""
            full
            size="large"
            placeholder="Укажите пароль"
            autocomplete="current-password"
            :max-length="AUTH_PASSWORD_MAXLENGTH"
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
import { AUTH_LOGIN_MAXLENGTH, AUTH_PASSWORD_MAXLENGTH, EColor } from '@kanban-board/common';

import type { TAuthTab } from '~/types/auth.types.ts';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIForm from '~/components/ui/UIForm.vue';

const emit = defineEmits<{
  'update:tab': [tab: TAuthTab];
}>();
</script>
