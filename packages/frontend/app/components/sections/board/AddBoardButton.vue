<template>
  <div :class="[full ? 'w-full' : 'w-fit']">
    <div class="flex w-full gap-8">
      <UIButton
        class="flex-1"
        prepend-icon="mingcute:add-line"
        :disabled="disabled || isModalOpen"
        :full="full"
        @click:button="isModalOpen = true"
      >
        Добавить доску
      </UIButton>
      <UITooltip v-if="showTooltip" :text="BOARDS_MAX_COUNT_ERROR_MESSAGE" size="large" />
    </div>

    <UpsertModal
      :is-open="isModalOpen"
      modal-title="Добавить доску"
      action-button-label="Добавить доску"
      :model-value="formData as TUpsertFormData"
      :form-errors="formErrors as TValidationErrors<TUpsertFormData>"
      :title-maxlength="BOARD_TITLE_MAXLENGTH"
      :description-maxlength="BOARD_DESCRIPTION_MAXLENGTH"
      :disabled="isLoading"
      body-class="w-320!"
      @click:action-button="createBoard"
      @update:is-open="closeModal"
      @update:field="update"
    />
  </div>
</template>

<script setup lang="ts">
import {
  BOARD_DESCRIPTION_MAXLENGTH,
  BOARD_TITLE_MAXLENGTH,
  BOARDS_MAX_COUNT_ERROR_MESSAGE,
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
import { BOARD_MESSAGES } from '~/constants/messages.constants.ts';
import type { TUpsertFormData } from '~/types/shared.types';

import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UITooltip from '~/components/ui/UITooltip.vue';

withDefaults(
  defineProps<{
    disabled?: boolean;
    showTooltip?: boolean;
    full?: boolean;
  }>(),
  {
    disabled: false,
    showTooltip: false,
    full: true,
  },
);

const emit = defineEmits<{
  'add:board': [payload: TBoardBase];
}>();

const toast = useToast();

const isModalOpen = ref(false);

const { formData, reset, formErrors, update } = useForm<TCreateBoard>({ title: '', description: '' });
const { emitEvent, isLoading } = useSocket();

const createBoard = () => {
  emitEvent<TCreateBoard, TUpsertBoardResponse>({
    event: EBoardEvent.CREATE,
    data: formData.value,
    successCallback: (response: TUpsertBoardResponse) => {
      if (response.isSuccess && response.data) {
        toast.success({ message: BOARD_MESSAGES.boardCreated });
        emit('add:board', response.data);
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
