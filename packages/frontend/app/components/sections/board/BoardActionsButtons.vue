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
      body-class="w-320!"
      @update:is-open="closeModal"
      @click:action-button="updateBoard"
      @update:field="update"
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
import { BOARD_MESSAGES } from '~/constants/messages.constants.ts';
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
  'update:board': [payload: TBoardBase];
  'delete:board': [payload: TDeleteBoardEmitPayload];
}>();

const toast = useToast();

const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const getInitialValue = (): Omit<TUpdateBoard, 'id'> => ({
  title: props.board.title,
  description: props.board?.description ?? '',
});

const { formData, reset, formErrors, isDirty, set, update } = useForm<Omit<TUpdateBoard, 'id'>>(getInitialValue());
const { isLoading: isLoadingUpdate, emitEvent: emitUpdate } = useSocket();
const { isLoading: isLoadingDelete, emitEvent: emitDelete } = useSocket();

const updateBoard = () => {
  const body: TUpdateBoard = {
    id: props.board.id,
    ...formData.value,
  };

  emitUpdate<TUpdateBoard, TUpsertBoardResponse>({
    event: EBoardEvent.UPDATE,
    data: body,
    successCallback: (response: TUpsertBoardResponse) => {
      if (response.isSuccess && response.data) {
        toast.success({ message: BOARD_MESSAGES.boardUpdated });
        emit('update:board', response.data);
        closeModal();
      }
    },
    errorCallback: (error: unknown) => {
      if (isValidationError(error)) formErrors.value = error.validation;
      else toast.error({ message: getErrorMessage(error) });
    },
  });
};

const deleteBoard = () => {
  emitDelete<number, TDeleteBoardResponse>({
    event: EBoardEvent.DELETE,
    data: props.board.id,
    successCallback: (response: TDeleteBoardResponse) => {
      if (response.isSuccess && response.data) {
        toast.success({ message: BOARD_MESSAGES.boardDeleted });
        emit('delete:board', response.data);
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

const closeModal = () => {
  isUpdateModalOpen.value = false;
  isDeleteModalOpen.value = false;
  reset();
};
</script>
