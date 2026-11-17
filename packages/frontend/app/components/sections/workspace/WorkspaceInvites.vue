<template>
  <div class="flex w-full flex-col gap-8">
    <div class="flex items-center gap-8">
      <span class="text-14">
        Приглашений осталось
        <span class="font-semibold" :class="isInvitesMaxCount ? 'text-red' : 'text-green'">
          {{ invites.available }}
        </span>
      </span>
      <UITooltip :text="TOOLTIP_TEXT" size="small" />
    </div>
    <div class="flex flex-col gap-12">
      <WorkspaceInviteCard
        v-for="inviteEl in invites.invites"
        :key="inviteEl.id"
        :invite="inviteEl"
        @delete:invite="emit('refresh')"
      />

      <div class="flex gap-8">
        <UIButton
          prepend-icon="mingcute:add-line"
          full
          :disabled="isInvitesMaxCount || isLoading"
          @click:button="isCreateInviteModalOpen = true"
        >
          Пригласить пользователя
        </UIButton>
        <UITooltip v-if="isInvitesMaxCount" :text="WORKSPACE_USERS_MAX_COUNT_ERROR_MESSAGE" size="large" />
      </div>
    </div>
  </div>

  <UIModal v-model:is-open="isCreateInviteModalOpen" title="Создать приглашение" body-class="w-full laptop:w-320!">
    <UIForm full action-button-label="Создать пришлашение" @submit:form="createInvite()" @reset:form="resetInvite()">
      <UILabel text="Название приглашения">
        <UIInput
          name="invite-name-input"
          :model-value="formData.name"
          :errors="formErrors.name"
          full
          :max-length="WORKSPACE_INVITE_NAME_MAXLENGTH"
          @update:model-value="update('name', $event)"
        />
      </UILabel>
    </UIForm>
  </UIModal>

  <UIModal
    v-if="inviteLink"
    v-model:is-open="isCreatedInviteModalOpen"
    title="Приглашение готово!"
    body-class="w-full laptop:w-320!"
    hide-close-button
  >
    <div class="flex w-full flex-col gap-12">
      <UIAlert>
        <span class="block">Скачайте приглашение и передайте пользователю!</span>
        <span>Восстановить его будет невозможно!</span>
      </UIAlert>

      <UIAlert>
        <span class="block">
          Если приглашение утеряно, или больше не нужно - отзовите его, чтобы освободить место.
        </span>
        <span>Через {{ inviteExpiresSting }} оно будет удалено автоматически.</span>
      </UIAlert>

      <UILabel text="Инвайт-ссылка">
        <UIInput name="invite-link-input" :model-value="inviteLink ?? ''" readonly full>
          <template #right>
            <UIIconButton
              icon="mingcute:copy-line"
              size="small"
              :background-color="EColor.BLUE"
              @click:button="copyLink()"
            />
          </template>
        </UIInput>
      </UILabel>

      <div class="flex flex-col gap-8">
        <UIButton full append-icon="mingcute:download-line" @click:button="saveData()">Скачать приглашение</UIButton>
        <UIButton full :background-color="EColor.RED" @click:button="finish()">Закрыть окно</UIButton>
      </div>
    </div>
  </UIModal>
</template>

<script setup lang="ts">
import {
  DatetimeUtility,
  EColor,
  FileUtility,
  getErrorMessage,
  isValidationError,
  StringUtility,
  type TCreateWorkspaceInviteBodySchema,
  type TCreateWorkspaceInviteResponse,
  type TCreateWorkspaceInviteToken,
  type TWorkspaceInvites,
  WORKSPACE_INVITE_LINK_EXPIRE_HOURS,
  WORKSPACE_INVITE_NAME_MAXLENGTH,
  WORKSPACE_USERS_MAX_COUNT,
  WORKSPACE_USERS_MAX_COUNT_ERROR_MESSAGE,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

import WorkspaceInviteCard from '~/components/sections/workspace/WorkspaceInviteCard.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';
import UIAlert from '~/components/ui/UIAlert.vue';
import UIForm from '~/components/ui/UIForm.vue';
import UILabel from '~/components/ui/UILabel.vue';
import UITooltip from '~/components/ui/UITooltip.vue';

const props = defineProps<{
  invites: TWorkspaceInvites;
}>();

const emit = defineEmits<{
  'refresh': [];
}>();

const { $api } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const toast = useToast();

const isInvitesMaxCount = computed(() => props.invites.available <= 0);
const inviteExpiresSting = computed(
  () =>
    `${WORKSPACE_INVITE_LINK_EXPIRE_HOURS} ${StringUtility.pluralize(WORKSPACE_INVITE_LINK_EXPIRE_HOURS, ['час', 'часа', 'часов'])}`,
);

const inviteLink = computed<string | null>(() =>
  inviteData.value == null
    ? null
    : `${runtimeConfig.public.FRONTEND_URL}/auth/register#${inviteData.value.inviteToken}`,
);

const { formData, formErrors, update, reset } = useForm<TCreateWorkspaceInviteBodySchema>({ name: '' });

const TOOLTIP_TEXT = `Вы можете пригласить пользователя в пространство, сгенерировав инвайт-ссылку. Приглашение активно ${inviteExpiresSting.value} с момента создания. Можно пригласить до ${WORKSPACE_USERS_MAX_COUNT} пользователей одновременно.`;

const isCreateInviteModalOpen = ref(false);
const isCreatedInviteModalOpen = ref(false);

const closeModals = () => {
  isCreateInviteModalOpen.value = false;
  isCreatedInviteModalOpen.value = false;
};

const resetInvite = () => {
  inviteData.value = null;
  reset();
  closeModals();
};

const finish = () => {
  resetInvite();
  emit('refresh');
};

const { copy, copied } = useClipboard();

const copyLink = async () => {
  if (!inviteLink.value) return;
  await copy(inviteLink.value);
  if (copied.value) {
    toast.success({ message: 'Ивайт-ссылка скопирована! Передайте ее пользователю' });
  }
};

const saveData = () => {
  if (!inviteLink.value || !inviteData.value) return;
  const lines = [
    `Внимание! Ссылка активна ${inviteExpiresSting.value} после создания.`,
    `Зарегистрироваться по ссылке можно только один раз. После регистрации Вам будет предоставлен логин и пароль для входа в систему. Сохраните их! Восстановить их будет невозможно.`,
    `Ссылка на регистрацию: ${inviteLink.value}`,
    `Ссылка активна до: ${DatetimeUtility.format(inviteData.value.expiresAt, 'DD.MM.YYYY HH:mm')}`,
  ];
  FileUtility.downloadFile(FileUtility.buildTextFile(lines, 'workspace-invite'));
};

const {
  data: inviteData,
  isLoading,
  call: createInvite,
} = useTryCatchFinally<TCreateWorkspaceInviteToken | null>({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api<TCreateWorkspaceInviteResponse>('/api/workspaces/invites', {
      body: formData.value,
      method: 'POST',
      signal,
    });

    if (result.isSuccess && result.data) {
      isCreateInviteModalOpen.value = false;
      isCreatedInviteModalOpen.value = true;
      toast.success({
        message: `Инвайт-ссылка готова! Передайте ссылку пользователю. Ссылка активна ${inviteExpiresSting.value}. По одной ссылке можно зарегистрироваться только одному пользователю.`,
      });
      return result.data;
    }

    return null;
  },
  catchCallback: (error: unknown) => {
    if (isValidationError(error)) formErrors.value = error.validation;
    else toast.error({ message: getErrorMessage(error) });
  },
});
</script>
