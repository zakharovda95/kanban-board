<template>
  <div class="size-fit">
    <StopPreventWrapper>
      <ActionsButtons @update="openUpdateModal" @delete="isDeleteModalOpen = true" />
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
  EBoardEvent,
  getErrorMessage,
  isValidationError,
  type TBoardBase,
  type TDeleteBoardEmitPayload,
  type TDeleteBoardResponse,
  type TUpdateBoard,
  type TUpsertBoardResponse,
  type TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable.ts';
import { useSocket } from '~/composables/use-socket.composable.ts';
import { BOARD_MESSAGES } from '~/constants/board.constants.ts';
import { CONFIRMATION_MODAL_TEXT } from '~/constants/ui.constants.ts';
import type { TUpsertFormData } from '~/types/shared.types.ts';

import ActionsButtons from '~/components/shared/ActionsButtons.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';
import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';

const props = defineProps<{
  board: TBoardBase;
}>();

const emit = defineEmits<{
  'update:boards': [payload: TBoardBase | TDeleteBoardEmitPayload];
}>();

const toast = useToast();

const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const closeModal = () => {
  isUpdateModalOpen.value = false;
  isDeleteModalOpen.value = false;
  reset();
};

const getInitialValue = (): Omit<TUpdateBoard, 'id'> => ({
  title: props.board.title,
  description: props.board?.description ?? '',
});

const { formData, reset, formErrors, isDirty, set } = useForm<Omit<TUpdateBoard, 'id'>>(getInitialValue());

const { isLoading: isLoadingUpdate, emitEvent: emitUpdate } = useSocket();

const updateBoard = () => {
  const body: TUpdateBoard = {
    id: props.board.id,
    title: formData.value.title || undefined,
    description: formData.value.description || null,
  };

  emitUpdate({
    event: EBoardEvent.UPDATE,
    data: body,
    successCallback: (response: TUpsertBoardResponse) => {
      if (response.isSuccess && response.data) {
        emit('update:boards', response.data);
        toast.success({ message: BOARD_MESSAGES.boardUpdated });
        closeModal();
      }
    },
    errorCallback: (error: unknown) => {
      if (isValidationError(error)) formErrors.value = error.validation;
      else toast.error({ message: getErrorMessage(error) });
    },
  });
};

const { isLoading: isLoadingDelete, emitEvent: emitDelete } = useSocket();

const deleteBoard = () => {
  emitDelete({
    event: EBoardEvent.DELETE,
    data: props.board.id,
    successCallback: (response: TDeleteBoardResponse) => {
      if (response.isSuccess && response.data) {
        emit('update:boards', response.data);
        toast.success({ message: BOARD_MESSAGES.boardDeleted });
        closeModal();
      }
    },
    errorCallback: (error: unknown) => {
      toast.error({ message: getErrorMessage(error) });
    },
  });
};

const openUpdateModal = () => {
  set(getInitialValue(), { setAsInitial: true, clearErrors: true });
  isUpdateModalOpen.value = true;
};
</script>
