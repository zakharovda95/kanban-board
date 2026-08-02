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
import type {
  TColumn,
  TPatchColumn,
  TSuccessResponse,
  TValidationErrorResponse,
  TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import { CONFIRMATION_MODAL_TEXT } from '~/constants/ui.constants.ts';
import type { TAction, TUpsertFormData } from '~/types/shared.types.ts';
import { getErrorMessage, isValidationError } from '~/utilities/error.utilities.ts';

import ActionsButtons from '~/components/shared/ActionsButtons.vue';
import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';

const props = defineProps<{ column: TColumn }>();

const emit = defineEmits<{
  'update:board': [];
}>();

const toast = useToast();

const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const closeModal = () => {
  isUpdateModalOpen.value = false;
  isDeleteModalOpen.value = false;
  reset();
};

const { formData, formErrors, reset, isDirty } = useForm<TPatchColumn>({
  title: props.column.title ?? '',
  description: props.column.description ?? '',
  color: props.column.color ?? '',
});

const onSuccessRequest = (action: TAction = 'update'): void => {
  toast.success({ message: action === 'update' ? 'Колонка обновлена!' : 'Колонка удалена!' });
  emit('update:board');
  closeModal();
};

const { isLoading: isLoadingUpdate, call: updateColumn } = useTryCatchFinally({
  callback: async () => {
    const body: TPatchColumn = {
      title: formData.value.title || undefined,
      description: formData.value.description || null,
      color: formData.value.color || undefined,
    };

    const result = await $fetch<TSuccessResponse>(`/api/columns/${props.column.id}`, {
      method: 'PATCH',
      body,
    });
    if (result.isSuccess) onSuccessRequest('update');
  },
  catchCallback: (error: unknown) => {
    if (isValidationError(error)) formErrors.value = (error as TValidationErrorResponse<TPatchColumn>).validation;
    else toast.error({ message: getErrorMessage(error) });
  },
});

const { isLoading: isLoadingDelete, call: deleteColumn } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch<TSuccessResponse>(`/api/columns/${props.column.id}`, {
      method: 'DELETE',
    });
    if (result.isSuccess) onSuccessRequest('delete');
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
