<template>
  <div class="w-full">
    <UIButton prepend-icon="add-line" full :size="ESize.MEDIUM" @click:button="isModalOpen = true">
      Добавить доску
    </UIButton>

    <UpsertModal
      :is-open="isModalOpen"
      modal-title="Добавить доску"
      action-button-label="Добавить доску"
      :model-value="formData as TUpsertFormData"
      :form-errors="formErrors as TValidationErrors<TUpsertFormData>"
      :title-maxlength="BOARD_TITLE_MAXLENGTH"
      :description-maxlength="BOARD_DESCRIPTION_MAXLENGTH"
      :disabled="isLoading"
      @click:action-button="createBoard"
      @update:is-open="closeModal"
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
  type TCreateBoard,
  type TUpsertBoardResponse,
  type TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { useSocket } from '~/composables/use-socket.composable.ts';
import { BOARD_MESSAGES } from '~/constants/board.constants.ts';
import { ESize } from '~/enums/global.enums';
import type { TUpsertFormData } from '~/types/shared.types';
import { toBody } from '~/utilities/object.utilities.ts';

import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';

const emit = defineEmits<{
  'add:board': [payload: TBoardBase];
}>();

const toast = useToast();

const isModalOpen = ref(false);

const { formData, reset, formErrors } = useForm<TCreateBoard>({ title: '', description: '' });
const { emitEvent, isLoading } = useSocket();

const createBoard = () => {
  emitEvent<TUpsertBoardResponse>({
    event: String(EBoardEvent.CREATE),
    data: toBody<TCreateBoard>(formData.value),
    successCallback: (response: TUpsertBoardResponse) => {
      if (response.isSuccess && response.data) {
        emit('add:board', response.data);
        toast.success({ message: BOARD_MESSAGES.boardCreated });
        navigateTo(`/boards/${response.data.id}`);
        closeModal();
      }
    },
    errorCallback: (error: unknown) => {
      if (isValidationError(error)) formErrors.value = error.validation;
      else toast.error({ message: getErrorMessage(error) });
    },
  });
};

const closeModal = () => {
  isModalOpen.value = false;
  reset();
};
</script>
