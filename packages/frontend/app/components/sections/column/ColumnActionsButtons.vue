<template>
  <div class="size-fit">
    <ActionsButtons
      :grid-template-columns="4"
      :actions="['moveToStart', 'moveToPrevious', 'moveToNext', 'moveToEnd', 'update', 'delete']"
      @update="openUpdateModal"
      @delete="isDeleteModalOpen = true"
    />

    <UpsertModal
      :is-open="isUpdateModalOpen"
      modal-title="Редактировать колонку"
      action-button-label="Редактировать колонку"
      :model-value="formData as TUpsertFormData"
      :form-errors="formErrors as TValidationErrors<TUpsertFormData>"
      :disabled="isLoadingUpdate || !isDirty"
      :title-maxlength="COLUMN_TITLE_MAXLENGTH"
      :description-maxlength="COLUMN_DESCRIPTION_MAXLENGTH"
      show-color-picker
      body-class="w-320!"
      @click:action-button="updateColumn"
      @update:is-open="closeModal"
      @update:field="update"
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
  COLUMN_DESCRIPTION_MAXLENGTH,
  COLUMN_TITLE_MAXLENGTH,
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

const getInitialValue = (): Omit<TUpdateColumn, 'id'> => ({
  title: props.column.title ?? '',
  description: props.column.description ?? '',
  color: props.column.color ?? '',
});

const { formData, formErrors, reset, isDirty, set, update } = useForm<Omit<TUpdateColumn, 'id'>>(getInitialValue());
const { emitEvent: emitEventUpdate, isLoading: isLoadingUpdate } = useSocket();
const { emitEvent: emitEventDelete, isLoading: isLoadingDelete } = useSocket();

const updateColumn = () => {
  const body: TUpdateColumn = {
    id: props.column.id,
    ...formData.value,
  };

  emitEventUpdate<TUpdateColumn, TUpsertColumnResponse>({
    event: EColumnEvent.UPDATE,
    data: body,
    successCallback: (response: TUpsertColumnResponse) => {
      if (response.isSuccess && response.data) {
        toast.success({ message: 'Колонка обновлена' });
        emit('update:column', response.data);
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
  emitEventDelete<number, TDeleteColumnResponse>({
    event: EColumnEvent.DELETE,
    data: props.column.id,
    successCallback: (response: TDeleteColumnResponse) => {
      if (response.isSuccess && response.data) {
        toast.success({ message: 'Колонка удалена' });
        emit('delete:column', response.data);
        closeModal();
      }
    },
    errorCallback: (error: unknown) => {
      toast.error({ message: getErrorMessage(error) });
    },
  });
};

const openUpdateModal = () => {
  isUpdateModalOpen.value = true;
  set(getInitialValue(), { setAsInitial: true, clearErrors: true });
};

const closeModal = () => {
  isUpdateModalOpen.value = false;
  isDeleteModalOpen.value = false;
  reset();
};
</script>
