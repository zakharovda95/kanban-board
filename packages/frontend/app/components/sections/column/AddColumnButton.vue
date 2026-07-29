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
      @click:action-button="call"
      @update:is-open="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ColorUtility,
  COLUMN_DESCRIPTION_MAXLENGTH,
  COLUMN_TITLE_MAXLENGTH,
  type TCreateColumn,
  type TCreateColumnResponse,
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
  'update:board': [];
}>();

const route = useRoute();

const toast = useToast();

const isModalOpen = ref(false);

const { formData, formErrors, reset } = useForm<TCreateColumn>({
  title: '',
  description: '',
  color: ColorUtility.getRandomHexColor(),
});

const { isLoading, call } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch<TCreateColumnResponse>(`/api/boards/${route.params.id}/columns`, {
      method: 'POST',
      body: toBody<TCreateColumn>(formData.value),
    });

    if (result.isSuccess) {
      toast.success({ message: 'Колонка добавлена!' });
      emit('update:board');
      closeModal();
    }
  },
  catchCallback: (error: unknown) => {
    if (isValidationError(error)) formErrors.value = (error as TValidationErrorResponse<TCreateColumn>).validation;
    else toast.error({ message: getErrorMessage(error) });
  },
});

const closeModal = () => {
  isModalOpen.value = false;
  reset();
};
</script>
