<template>
  <div class="w-fit">
    <UIIconButton icon="add-line" @click:button="isModalOpen = true" />

    <UpsertModal
      :is-open="isModalOpen"
      modal-title="Добавить задачу"
      action-button-label="Добавить задачу"
      :model-value="formData as TUpsertFormData"
      :form-errors="formErrors as TValidationErrors<TUpsertFormData>"
      :title-maxlength="ISSUE_TITLE_MAXLENGTH"
      :disabled="isLoading"
      description-component="editor"
      @click:action-button="call"
      @update:is-open="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ISSUE_TITLE_MAXLENGTH,
  type TCreateIssue,
  type TCreateIssueResponse,
  type TValidationErrorResponse,
  type TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import type { TUpsertFormData } from '~/types/shared.types';
import { getErrorMessage, isValidationError } from '~/utilities/error.utilities';
import { toBody } from '~/utilities/object.utilities';

import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const props = defineProps<{
  columnId: number;
}>();

const emit = defineEmits<{
  'update:columns': [];
}>();

const route = useRoute();
const toast = useToast();

const isModalOpen = ref(false);

const { formData, formErrors, reset } = useForm<TCreateIssue>({ title: '', description: '' });

const { isLoading, call } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch<TCreateIssueResponse>(
      `/api/boards/${route.params.id}/columns/${props.columnId}/issues`,
      {
        method: 'POST',
        body: toBody<TCreateIssue>(formData.value),
      },
    );

    if (result.isSuccess) {
      toast.success({ message: 'Задача добавлена!' });
      emit('update:columns');
      closeModal();
    }
  },
  catchCallback: (error: unknown) => {
    if (isValidationError(error)) formErrors.value = (error as TValidationErrorResponse<TCreateIssue>).validation;
    else toast.error({ message: getErrorMessage(error) });
  },
});

const closeModal = () => {
  isModalOpen.value = false;
  reset();
};
</script>
