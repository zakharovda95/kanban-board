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
      @click:action-button="call"
      @update:is-open="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {
  BOARD_DESCRIPTION_MAXLENGTH,
  BOARD_TITLE_MAXLENGTH,
  type TCreateBoard,
  type TCreateBoardResponse,
  type TValidationErrorResponse,
  type TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import { ESize } from '~/enums/global.enums';
import type { TUpsertFormData } from '~/types/shared.types';
import { getErrorMessage, isValidationError } from '~/utilities/error.utilities';
import { toBody } from '~/utilities/object.utilities';

import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';

const emit = defineEmits<{
  'update:boards': [id?: number];
}>();

const toast = useToast();

const isModalOpen = ref(false);

const { formData, reset, formErrors } = useForm<TCreateBoard>({ title: '', description: '' });

const { isLoading, call } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch<TCreateBoardResponse>('/api/boards', {
      method: 'POST',
      body: toBody<TCreateBoard>(formData.value),
    });

    if (result.isSuccess) {
      toast.success({ message: 'Доска создана!' });
      emit('update:boards', result?.data?.id);
      closeModal();
    }
  },
  catchCallback: (error: unknown) => {
    if (isValidationError(error)) formErrors.value = (error as TValidationErrorResponse<TCreateBoard>).validation;
    else toast.error({ message: getErrorMessage(error) });
  },
});

const closeModal = () => {
  isModalOpen.value = false;
  reset();
};
</script>
