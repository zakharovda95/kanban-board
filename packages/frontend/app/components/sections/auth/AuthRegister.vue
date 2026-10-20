<template>
  <div class="bg-light-base rounded-12 w-full p-12">
    <UIForm
      title="Создать аккаунт"
      full
      buttons-size="large"
      buttons-position="row"
      action-button-label="Создать аккаунт"
      hide-reject-button
    >
      <div class="flex w-full flex-col gap-16">
        <UILabel text="Имя" size="medium" required>
          <UIInput
            name="auth-login"
            model-value=""
            full
            size="large"
            placeholder="Укажите имя"
            readonly
            autocomplete="username"
          />
        </UILabel>
        <UILabel text="Фамилия" size="medium" required>
          <UIInput
            name="auth-login"
            model-value=""
            full
            size="large"
            placeholder="Укажите фамилию"
            readonly
            autocomplete="current-password"
          />
        </UILabel>

        <div class="flex w-full items-center justify-end">
          <UIButton size="medium" prepend-icon="mingcute:refresh-2-line" :background-color="EColor.LIGHT_500">
            Обновить
          </UIButton>
        </div>
      </div>
    </UIForm>
  </div>

  <UIButton
    append-icon="mingcute:entrance-fill"
    append-icon-class="rotate-180"
    :background-color="EColor.BLUE"
    @click:button="emit('update:tab', 'login')"
  >
    У меня уже есть аккаунт
  </UIButton>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import type { TAuthTab } from '~/types/auth.types.ts';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIForm from '~/components/ui/UIForm.vue';

const emit = defineEmits<{
  'update:tab': [tab: TAuthTab];
}>();
</script>
