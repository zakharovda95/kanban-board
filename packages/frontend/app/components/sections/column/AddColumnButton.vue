<template>
  <div class="w-fit">
    <UIButton prepend-icon="add-line" :size="ESize.MEDIUM" @click:button="isModalOpen = true">
      Добавить колонку
    </UIButton>

    <UpsertModal
      :is-open="isModalOpen"
      modal-title="Добавить колонку"
      action-button-label="Добавить колонку"
      :model-value="formData as TUpsertFormData"
      :form-errors="formErrors as TValidationErrors<TUpsertFormData>"
      :title-maxlength="COLUMN_TITLE_MAXLENGTH"
      :description-maxlength="COLUMN_DESCRIPTION_MAXLENGTH"
      :disabled="isLoading"
      show-color-picker
      @click:action-button="createBoard"
      @update:is-open="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ColorUtility,
  COLUMN_DESCRIPTION_MAXLENGTH,
  COLUMN_TITLE_MAXLENGTH,
  EColumnEvent,
  getErrorMessage,
  isValidationError,
  type TColumn,
  type TCreateColumn,
  type TUpsertColumnResponse,
  type TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { useSocket } from '~/composables/use-socket.composable.ts';
import { COLUMN_MESSAGES } from '~/constants/column.constants.ts';
import { ESize } from '~/enums/global.enums';
import type { TUpsertFormData } from '~/types/shared.types';
import { toBody } from '~/utilities/object.utilities';

import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';

const emit = defineEmits<{
  'add:column': [column: TColumn];
}>();

const route = useRoute();
const toast = useToast();
const { emitEvent, isLoading } = useSocket();

const isModalOpen = ref(false);

const { formData, formErrors, reset } = useForm<Omit<TCreateColumn, 'boardId'>>({
  title: '',
  description: '',
  color: ColorUtility.getRandomHexColor(),
});

const createBoard = () => {
  emitEvent({
    event: EColumnEvent.CREATE,
    data: {
      boardId: Number(route.params.id),
      ...toBody<Omit<TCreateColumn, 'boardId'>>(formData.value),
    },
    successCallback: async (response: TUpsertColumnResponse) => {
      if (response.isSuccess && response.data) {
        emit('add:column', response.data);
        toast.success({ message: COLUMN_MESSAGES.columnCreated });
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
