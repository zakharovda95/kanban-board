<template>
  <div class="w-fit">
    <UIButton prepend-icon="add-line" :size="ESize.MEDIUM" @click:button="isModalOpen = true">
      Добавить колонку
    </UIButton>

    <UpsertModal
      modal-title="Добавить колонку"
      action-button-label="Добавить колонку"
      :model-value="formData as TUpsertFormData"
      :title-maxlength="COLUMN_TITLE_MAXLENGTH"
      :description-maxlength="COLUMN_DESCRIPTION_MAXLENGTH"
      :form-errors="formErrors"
      :is-open="isModalOpen"
      :disabled="isLoading"
      @click:action-button="call"
      @update:is-open="closeModal"
    >
      <UILabel text="Цвет">
        <UIColorPicker v-model="formData.color" :size="ESize.MEDIUM" />
      </UILabel>
    </UpsertModal>
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
  'update:columns': [];
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
      emit('update:columns');
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
