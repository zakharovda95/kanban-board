<template>
  <div class="size-fit">
    <ActionsButtons
      :grid-template-columns="4"
      :actions="['moveToStart', 'moveToPrevious', 'moveToNext', 'moveToEnd', 'update', 'delete']"
      @update="isUpdateModalOpen = true"
      @delete="isDeleteModalOpen = true"
    />

    <UpsertModal
      :is-open="isUpdateModalOpen"
      modal-title="Редактировать колонку"
      action-button-label="Редактировать колонку"
      :model-value="formData as TUpsertFormData"
      :form-errors="formErrors as TValidationErrors<TUpsertFormData>"
      :disabled="isLoadingUpdate || !isDirty"
      show-color-picker
      @click:action-button="updateColumn"
      @update:is-open="closeModal"
    />

    <UIConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Удалить колонку?"
      :text="CONFIRMATION_MODAL_TEXT"
      action-button-label="Да, удалить колонку"
      :disabled="isLoadingDelete"
      @click:confirm="deleteColumn"
      @update:is-open="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {
  EColumnEvent,
  getErrorMessage,
  isValidationError,
  type TColumn,
  type TDeleteColumnEmitPayload,
  type TDeleteColumnResponse,
  type TUpdateColumn,
  type TUpsertColumnResponse,
  type TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable.ts';
import { useSocket } from '~/composables/use-socket.composable.ts';
import { COLUMN_MESSAGES } from '~/constants/column.constants.ts';
import { CONFIRMATION_MODAL_TEXT } from '~/constants/ui.constants.ts';
import type { TUpsertFormData } from '~/types/shared.types.ts';

import ActionsButtons from '~/components/shared/ActionsButtons.vue';
import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';

const props = defineProps<{ column: TColumn }>();

const emit = defineEmits<{
  'update:column': [payload: TColumn];
  'delete:column': [payload: TDeleteColumnEmitPayload];
}>();

const toast = useToast();

const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const closeModal = () => {
  isUpdateModalOpen.value = false;
  isDeleteModalOpen.value = false;
  reset();
};

const { formData, formErrors, reset, isDirty } = useForm<TUpdateColumn>({
  title: props.column.title ?? '',
  description: props.column.description ?? '',
  color: props.column.color ?? '',
});

const { emitEvent: emitEventUpdate, isLoading: isLoadingUpdate } = useSocket();
const { emitEvent: emitEventDelete, isLoading: isLoadingDelete } = useSocket();

const updateColumn = () => {
  const body: TUpdateColumn = {
    id: props.column.id,
    title: formData.value.title || undefined,
    description: formData.value.description || null,
    color: formData.value.color || undefined,
  };

  emitEventUpdate({
    event: EColumnEvent.UPDATE,
    data: body,
    successCallback: (response: TUpsertColumnResponse) => {
      if (response.isSuccess && response.data) {
        emit('update:column', response.data);
        toast.success({ message: COLUMN_MESSAGES.columnUpdated });
        closeModal();
      }
    },
    errorCallback: (error: unknown) => {
      if (isValidationError(error)) formErrors.value = error.validation;
      else toast.error({ message: getErrorMessage(error) });
    },
  });
};

const deleteColumn = () => {
  emitEventDelete({
    event: EColumnEvent.DELETE,
    data: props.column.id,
    successCallback: (response: TDeleteColumnResponse) => {
      if (response.isSuccess && response.data) {
        emit('delete:column', response.data);
        toast.success({ message: COLUMN_MESSAGES.columnDeleted });
        closeModal();
      }
    },
    errorCallback: (error: unknown) => {
      toast.error({ message: getErrorMessage(error) });
    },
  });
};
</script>
