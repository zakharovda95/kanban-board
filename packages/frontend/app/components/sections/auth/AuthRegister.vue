<template>
  <div class="bg-light-base rounded-12 w-full p-12">
    <UIForm
      v-if="activeView === 'form'"
      title="Создать аккаунт"
      full
      buttons-size="large"
      buttons-position="row"
      action-button-label="Создать аккаунт"
      hide-reject-button
      :disabled="isLoading"
      @submit:form="call()"
    >
      <div class="flex w-full flex-col gap-16">
        <UILabel text="Имя" size="medium" required>
          <UIInput
            v-model="formData.firstName"
            name="auth-first-name"
            full
            size="large"
            placeholder="Укажите имя"
            readonly
            autocomplete="username"
          >
            <template #right>
              <UITooltip text="Обновить имя">
                <UIIconButton
                  icon="mingcute:refresh-2-line"
                  size="small"
                  :background-color="EColor.BLUE"
                  @click:button="formData.firstName = getRandomFirstName()"
                />
              </UITooltip>
            </template>
          </UIInput>
        </UILabel>
        <UILabel text="Фамилия" size="medium" required>
          <UIInput
            v-model="formData.lastName"
            name="auth-last-name"
            full
            size="large"
            placeholder="Укажите фамилию"
            readonly
            autocomplete="current-password"
          >
            <template #right>
              <UITooltip text="Обновить фамилию">
                <UIIconButton
                  icon="mingcute:refresh-2-line"
                  size="small"
                  :background-color="EColor.BLUE"
                  @click:button="formData.lastName = getRandomLastName()"
                />
              </UITooltip>
            </template>
          </UIInput>
        </UILabel>
      </div>
    </UIForm>
    <UIForm
      v-else-if="activeView === 'result' && data"
      title="Ваш аккаунт готов!"
      full
      buttons-size="large"
      buttons-position="row"
      action-button-label="Скачать данные входа"
      hide-reject-button
      action-button-icon="mingcute:download-line"
      @submit:form="saveData"
    >
      <div class="flex w-full flex-col gap-16">
        <UIAlert>
          <span class="block">Скопируйте и сохраните логин и пароль.</span>
          <span>Восстановить из будет невозможно!</span>
        </UIAlert>

        <UILabel text="Ваш логин" size="medium">
          <UIInput
            :model-value="data.login"
            name="auth-login"
            full
            size="large"
            placeholder="Скопируйте логин"
            readonly
          >
            <template #right>
              <UIIconButton
                icon="mingcute:copy-line"
                size="small"
                :background-color="EColor.BLUE"
                @click:button="copyLogin"
              />
            </template>
          </UIInput>
        </UILabel>
        <UILabel text="Ваш пароль" size="medium">
          <UIInput
            :model-value="data.password"
            name="auth-password"
            full
            size="large"
            placeholder="Скопируйте пароль"
            readonly
          >
            <template #right>
              <UIIconButton
                icon="mingcute:copy-line"
                size="small"
                :background-color="EColor.BLUE"
                @click:button="copyPassword"
              />
            </template>
          </UIInput>
        </UILabel>
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
import {
  EColor,
  FileUtility,
  getErrorMessage,
  RandomUtility,
  type TAuthLoginBodySchema,
  type TAuthRegisterBodySchema,
  type TAuthRegisterResponse,
  USER_FIRST_NAMES,
  USER_LAST_NAMES,
} from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import type { TAuthTab } from '~/types/auth.types.ts';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIAlert from '~/components/ui/UIAlert.vue';
import UIForm from '~/components/ui/UIForm.vue';
import UILabel from '~/components/ui/UILabel.vue';
import UITooltip from '~/components/ui/UITooltip.vue';

const emit = defineEmits<{
  'update:tab': [tab: TAuthTab];
}>();

const { $api } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const activeView = ref<'form' | 'result'>('form');

const getRandomFirstName = () => RandomUtility.getRandomFromArray<string>(USER_FIRST_NAMES);
const getRandomLastName = () => RandomUtility.getRandomFromArray<string>(USER_LAST_NAMES);

const { copy, copied } = useClipboard();

const copyLogin = async () => {
  if (!data.value) return;
  await copy(data.value.login);
  if (copied.value) {
    toast.success({ message: 'Ваш логин скопирован!' });
  }
};

const copyPassword = async () => {
  if (!data.value) return;
  await copy(data.value.login);
  if (copied.value) {
    toast.success({ message: 'Ваш пароль скопирован!' });
  }
};

const saveData = () => {
  const lines = [
    `Ссылка: ${runtimeConfig.public.FRONTEND_URL}/auth?view=login`,
    `Имя: ${formData.firstName}`,
    `Фамилия: ${formData.lastName}`,
    `Логин: ${data.value?.login ?? 'Ошибка'}`,
    `Пароль: ${data.value?.password ?? 'Ошибка'}`,
  ];
  FileUtility.downloadFile(FileUtility.buildTextFile(lines, 'my-auth-data'));
};

const formData = reactive<TAuthRegisterBodySchema>({
  firstName: getRandomFirstName(),
  lastName: getRandomLastName(),
});

const { call, isLoading, data } = useTryCatchFinally<null | TAuthLoginBodySchema>({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api<TAuthRegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: formData,
      signal,
    });
    if (result.isSuccess && result.data) {
      toast.success({
        message: 'Аккаунт создан! Сохраните предоставленные логин и пароль, восстановить из будет невозможно!',
      });

      activeView.value = 'result';

      return result.data;
    }
    return null;
  },
  catchCallback: (error: unknown) => toast.error({ message: getErrorMessage(error) }),
  callOnInit: false,
  useAbort: true,
});
</script>
