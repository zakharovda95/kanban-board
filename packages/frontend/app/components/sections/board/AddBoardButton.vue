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
  isSuccessResponse,
  isValidationError,
  type TCreateBoard,
  type TCreateBoardResponse,
  type TErrorResponse,
  type TValidationErrorResponse,
  type TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { ESize } from '~/enums/global.enums';
import type { TUpsertFormData } from '~/types/shared.types';
import { toBody } from '~/utilities/object.utilities.ts';

import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';

const toast = useToast();
const { $socket } = useNuxtApp();

const isModalOpen = ref(false);

const { formData, reset, formErrors } = useForm<TCreateBoard>({ title: '', description: '' });

const isLoading = ref(false);
const createBoard = () => {
  isLoading.value = true;
  $socket.emit(
    EBoardEvent.CREATE,
    toBody<TCreateBoard>(formData.value),
    (response: TCreateBoardResponse | TErrorResponse | TValidationErrorResponse<TCreateBoard>) => {
      isLoading.value = false;

      if (isSuccessResponse<{ id: number }>(response)) {
        const id = response.data?.id;
        if (id) navigateTo(`/boards/${id}`);
        toast.success({ message: 'Доска создана!' });
        closeModal();
        return;
      }

      if (isValidationError(response)) {
        formErrors.value = response.validation;
        return;
      }

      toast.error({ message: getErrorMessage(response) });
    },
  );
};

const closeModal = () => {
  isModalOpen.value = false;
  reset();
};
</script>
