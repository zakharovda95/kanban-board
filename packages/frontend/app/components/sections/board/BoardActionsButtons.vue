<template>
  <div class="size-fit">
    <StopPreventWrapper>
      <ActionsButtons @update="isUpdateModalOpen = true" @delete="isDeleteModalOpen = true" />
    </StopPreventWrapper>

    <UpsertModal
      :is-open="isUpdateModalOpen"
      modal-title="Редактировать доску"
      action-button-label="Редактировать доску"
      :model-value="formData as TUpsertFormData"
      :form-errors="formErrors as TValidationErrors<TUpsertFormData>"
      :title-maxlength="BOARD_TITLE_MAXLENGTH"
      :description-maxlength="BOARD_DESCRIPTION_MAXLENGTH"
      :disabled="isLoadingUpdate || !isDirty"
      @update:is-open="closeModal"
      @click:action-button="updateBoard"
    />

    <UIConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Удалить доску?"
      :text="CONFIRMATION_MODAL_TEXT"
      action-button-label="Да, удалить доску"
      :disabled="isLoadingDelete"
      @update:is-open="closeModal"
      @click:confirm="deleteBoard"
    />
  </div>
</template>

<script setup lang="ts">
import {
  BOARD_DESCRIPTION_MAXLENGTH,
  BOARD_TITLE_MAXLENGTH,
  type TBoardBase,
  type TPatchBoard,
  type TSuccessResponse,
  type TValidationErrorResponse,
  type TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable.ts';
import { CONFIRMATION_MODAL_TEXT } from '~/constants/ui.constants.ts';
import type { TAction, TUpsertFormData } from '~/types/shared.types.ts';
import { getErrorMessage, isValidationError } from '~/utilities/error.utilities.ts';
import { toBody } from '~/utilities/object.utilities.ts';

import ActionsButtons from '~/components/shared/ActionsButtons.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';
import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';

const props = defineProps<{
  board: TBoardBase;
}>();

const emit = defineEmits<{
  'update:boards': [action: TAction, id: number];
}>();

const toast = useToast();

const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const closeModal = () => {
  isUpdateModalOpen.value = false;
  isDeleteModalOpen.value = false;
  reset();
};

const { formData, reset, formErrors, isDirty } = useForm<TPatchBoard>({
  title: props.board.title,
  description: props.board?.description ?? '',
});

const onSuccessRequest = (action: TAction = 'update'): void => {
  toast.success({ message: action === 'update' ? 'Доска обновлена!' : 'Доска удалена!' });
  emit('update:boards', action, props.board.id);
  closeModal();
};

const { isLoading: isLoadingUpdate, call: updateBoard } = useTryCatchFinally({
  callback: async () => {
    const body: TPatchBoard = {
      title: formData.value.title || undefined,
      description: formData.value.description || null,
    };

    const result = await $fetch<TSuccessResponse>(`/api/boards/${props.board.id}`, { method: 'PATCH', body });
    if (result.isSuccess) onSuccessRequest('update');
  },
  catchCallback: (error: unknown) => {
    if (isValidationError(error)) formErrors.value = (error as TValidationErrorResponse<TPatchBoard>).validation;
    else toast.error({ message: getErrorMessage(error) });
  },
});

const { isLoading: isLoadingDelete, call: deleteBoard } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch<TSuccessResponse>(`/api/boards/${props.board.id}`, {
      method: 'DELETE',
      body: toBody<TPatchBoard>(formData.value),
    });
    if (result.isSuccess) onSuccessRequest('delete');
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
