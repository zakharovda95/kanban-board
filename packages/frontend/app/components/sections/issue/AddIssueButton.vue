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
      @click:action-button="createIssue"
      @update:is-open="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {
  EIssueEvent,
  getErrorMessage,
  ISSUE_TITLE_MAXLENGTH,
  isValidationError,
  type TCreateIssue,
  type TIssueBase,
  type TUpsertIssueResponse,
  type TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { useSocket } from '~/composables/use-socket.composable.ts';
import { ISSUE_MESSAGES } from '~/constants/issue.constants.ts';
import type { TUpsertFormData } from '~/types/shared.types';
import { toBody } from '~/utilities/object.utilities';

import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const props = defineProps<{
  columnId: number;
}>();

const emit = defineEmits<{
  'add:issue': [payload: TIssueBase];
}>();

const route = useRoute();
const toast = useToast();

const isModalOpen = ref(false);

const { formData, formErrors, reset } = useForm<Partial<TCreateIssue>>({ title: '', description: '' });
const { emitEvent, isLoading } = useSocket();

const createIssue = () => {
  emitEvent({
    event: EIssueEvent.CREATE,
    data: {
      columnId: props.columnId,
      boardId: Number(route.params.id),
      ...toBody<Partial<TCreateIssue>>(formData.value),
    },
    successCallback: (response: TUpsertIssueResponse) => {
      if (response.isSuccess && response.data) {
        emit('add:issue', response.data);
        toast.success({ message: ISSUE_MESSAGES.issueCreated });
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
