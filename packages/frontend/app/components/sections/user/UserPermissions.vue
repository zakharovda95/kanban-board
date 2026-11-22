<template>
  <div class="flex w-full flex-col gap-12">
    <span class="text-14">Настройка разрешений</span>
    <UIAccordion title="Профиль" :background-color="EColor.LIGHT_100">
      <div class="flex flex-col gap-8">
        <UILabel
          v-for="(_, type) in formData.profile"
          :key="type"
          :text="PROFILE_USER_PERMISSION_LABELS[type]"
          position="between"
          direction="row"
        >
          <UISwitcher v-model="formData.profile[type]" size="medium" />
        </UILabel>
      </div>
    </UIAccordion>

    <UIAccordion title="Доски" :background-color="EColor.LIGHT_100">
      <div class="flex flex-col gap-8">
        <UILabel
          v-for="(_, type) in formData.board"
          :key="type"
          :text="BOARD_USER_PERMISSION_LABELS[type]"
          position="between"
          direction="row"
        >
          <UISwitcher v-model="formData.board[type]" size="medium" />
        </UILabel>
      </div>
    </UIAccordion>

    <UIAccordion
      v-for="boardAccess in formData.boardsAccesses"
      :key="boardAccess.id"
      :title="boardAccess.title"
      :background-color="EColor.LIGHT_100"
    >
      <div class="flex flex-col gap-8">
        <template v-for="(_, type) in boardAccess.permissions" :key="type">
          <UIDivider v-if="DIVIDER_BEFORE.has(type)" variant="dashed" />
          <UILabel :text="BOARD_ACCESS_USER_PERMISSION_LABELS[type]" position="between" direction="row">
            <UISwitcher v-model="boardAccess.permissions[type]" size="medium" />
          </UILabel>
        </template>
      </div>
    </UIAccordion>

    <UIButton :disabled="isUpdating || !isDirty" full @click:button="updatePermissions()">
      Сохранить изменения
    </UIButton>
  </div>
</template>

<script setup lang="ts">
import {
  BOARD_ACCESS_USER_PERMISSION_LABELS,
  BOARD_USER_PERMISSION_LABELS,
  EBoardAccessUserPermissionType,
  EColor,
  getErrorMessage,
  PROFILE_USER_PERMISSION_LABELS,
  type TSuccessResponse,
  type TUserPermissions,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIAccordion from '~/components/ui/UIAccordion.vue';
import UIDivider from '~/components/ui/UIDivider.vue';
import UILabel from '~/components/ui/UILabel.vue';
import UISwitcher from '~/components/ui/UISwitcher.vue';

const permissions = defineModel<TUserPermissions>('permissions', { required: true });

const props = defineProps<{
  userId: number;
}>();

const { $api } = useNuxtApp();
const toast = useToast();

// Для условия рендера UIDivider, чтобы визуально разделить разрешения доски, колонок и задач у конкретной доски
const DIVIDER_BEFORE = new Set<EBoardAccessUserPermissionType>([
  EBoardAccessUserPermissionType.COLUMN_CREATE,
  EBoardAccessUserPermissionType.ISSUE_CREATE,
]);

const { formData, isDirty, set } = useForm<TUserPermissions>(permissions.value);

const { call: updatePermissions, isLoading: isUpdating } = useTryCatchFinally({
  callback: async (_, signal?: AbortSignal) => {
    const result = await $api<TSuccessResponse>(`/api/users/${props.userId}/permissions`, {
      method: 'PUT',
      body: formData.value,
      signal,
    });

    if (result.isSuccess) {
      // обновляем в родительском компоненте
      permissions.value = formData.value;
      // устанавливаем в форме как изначальное значение, чтобы сбросить isDirty
      set(formData.value, { setAsInitial: true, clearErrors: true });
      toast.success({ message: 'Разрешения обновлены' });
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
