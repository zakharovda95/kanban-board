<template>
  <div class="flex w-full flex-col gap-12">
    <span class="text-14">Настройка разрешений</span>
    <UIAccordion title="Профиль" :background-color="EColor.LIGHT_100">
      <div class="flex flex-col gap-8">
        <UILabel
          v-for="(value, field) in permissions.profile"
          :key="field"
          :text="PROFILE_PERMISSION_LABELS[field]"
          position="between"
          direction="row"
        >
          <UISwitcher
            :model-value="value"
            size="medium"
            :disabled="isUpdating"
            @update:model-value="updatePermission({ type: EPermissionType.PROFILE, field, value: $event })"
          />
        </UILabel>
      </div>
    </UIAccordion>

    <UIAccordion title="Доски" :background-color="EColor.LIGHT_100">
      <div class="flex flex-col gap-8">
        <UILabel
          v-for="(value, field) in permissions.board"
          :key="field"
          :text="BOARD_PERMISSION_LABELS[field]"
          position="between"
          direction="row"
        >
          <UISwitcher
            :model-value="value"
            size="medium"
            :disabled="isUpdating"
            @update:model-value="updatePermission({ type: EPermissionType.BOARD, field, value: $event })"
          />
        </UILabel>
      </div>
    </UIAccordion>

    <UIAccordion
      v-for="boardAccess in permissions.boardAccesses"
      :key="boardAccess.id"
      :title="boardAccess.title"
      :background-color="EColor.LIGHT_100"
    >
      <div class="flex flex-col gap-8">
        <template v-for="(value, field) in boardAccess.permissions" :key="field">
          <UIDivider v-if="DIVIDER_BEFORE.has(field)" variant="dashed" />
          <UILabel :text="BOARD_ACCESS_PERMISSION_LABELS[field]" position="between" direction="row">
            <UISwitcher
              :model-value="value"
              size="medium"
              :disabled="isUpdating"
              @update:model-value="
                updatePermission({
                  type: EPermissionType.BOARD_ACCESSES,
                  field,
                  value: $event,
                  boardId: boardAccess.id,
                })
              "
            />
          </UILabel>
        </template>
      </div>
    </UIAccordion>
  </div>
</template>

<script setup lang="ts">
import {
  BOARD_ACCESS_PERMISSION_LABELS,
  BOARD_PERMISSION_LABELS,
  EBoardAccessPermissionField,
  EColor,
  EPermissionType,
  getErrorMessage,
  PROFILE_PERMISSION_LABELS,
  type TPermissions,
  type TSuccessResponse,
  type TUpdatePermissionBodySchema,
} from '@kanban-board/common';

import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';

import UIAccordion from '~/components/ui/UIAccordion.vue';
import UIDivider from '~/components/ui/UIDivider.vue';
import UILabel from '~/components/ui/UILabel.vue';
import UISwitcher from '~/components/ui/UISwitcher.vue';

const permissions = defineModel<TPermissions>('permissions', { required: true });

const props = defineProps<{
  userId: number;
}>();

const { $api } = useNuxtApp();
const toast = useToast();

// Для условия рендера UIDivider, чтобы визуально разделить разрешения доски, колонок и задач у конкретной доски
const DIVIDER_BEFORE = new Set<EBoardAccessPermissionField>([
  EBoardAccessPermissionField.COLUMN_CREATE,
  EBoardAccessPermissionField.ISSUE_CREATE,
]);

const setPermissionValue = (body: TUpdatePermissionBodySchema): void => {
  switch (body.type) {
    case EPermissionType.PROFILE: {
      permissions.value[EPermissionType.PROFILE][body.field] = body.value;
      break;
    }
    case EPermissionType.BOARD: {
      permissions.value[EPermissionType.BOARD][body.field] = body.value;
      break;
    }
    case EPermissionType.BOARD_ACCESSES: {
      const access = permissions.value[EPermissionType.BOARD_ACCESSES].find(({ id }) => id === body.boardId);
      if (access) access.permissions[body.field] = body.value;
      break;
    }
  }
};

const { call: updatePermission, isLoading: isUpdating } = useTryCatchFinally<undefined, TUpdatePermissionBodySchema>({
  callback: async (body?: TUpdatePermissionBodySchema, signal?: AbortSignal) => {
    if (!body) {
      toast.error({ message: 'Не передано разрешение' });
      return;
    }

    const result = await $api<TSuccessResponse>(`/api/users/${props.userId}/permissions`, {
      method: 'POST',
      body,
      signal,
    });

    if (result.isSuccess) setPermissionValue(body);
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
