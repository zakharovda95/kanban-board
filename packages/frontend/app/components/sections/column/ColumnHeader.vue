<template>
  <header
    class="bg-light-base flex h-52 w-full flex-col border-b-4 px-12 py-8 text-left"
    :style="{ borderBottomColor: column.color }"
  >
    <div class="flex size-full flex-nowrap items-center justify-between gap-8">
      <div class="flex flex-1 justify-between gap-8">
        <div class="h-full flex-1 overflow-hidden">
          <p class="text-14 font-medium text-ellipsis whitespace-nowrap">{{ column.title }}</p>
          <p class="text-elipsis text-12 w-full overflow-hidden font-light">
            {{ column.description }}
          </p>
        </div>

        <BaseActionsButtons show-move-button @update="isUpdateModalOpen = true" @delete="isDeleteModalOpen = true" />
      </div>
    </div>

    <UpsertModal
      :is-open="isUpdateModalOpen"
      modal-title="Редактировать колонку"
      action-button-label="Редактировать колонку"
      :model-value="formData as TUpsertFormData"
      :form-errors="formErrors as TValidationErrors<TUpsertFormData>"
      :disabled="isLoadingUpdate || !isDirty"
      show-color-picker
      @click:action-button="updateColumn"
      @update:is-open="closeModal"
    />

    <UIConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Удалить колонку?"
      action-button-label="Да, удалить колонку"
      text="Восстановить данные будет невозможно!"
      :disabled="isLoadingDelete"
      @click:confirm="deleteColumn"
      @update:is-open="closeModal"
    />
  </header>
</template>

<script setup lang="ts">
import type {
  TColumn,
  TPatchColumn,
  TSuccessResponse,
  TValidationErrorResponse,
  TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import type { TBaseAction, TUpsertFormData } from '~/types/shared.types';
import { getErrorMessage, isValidationError } from '~/utilities/error.utilities';

import BaseActionsButtons from '~/components/shared/BaseActionsButtons.vue';
import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';

const props = defineProps<{ column: TColumn }>();

const emit = defineEmits<{
  'update:columns': [];
}>();

const route = useRoute();

const toast = useToast();

const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const closeModal = () => {
  isUpdateModalOpen.value = false;
  isDeleteModalOpen.value = false;
  reset();
};

const { formData, formErrors, reset, isDirty } = useForm<TPatchColumn>({
  title: props.column.title ?? '',
  description: props.column.description ?? '',
  color: props.column.color ?? '',
});

const onSuccessRequest = (action: TBaseAction = 'update'): void => {
  toast.success({ message: action === 'update' ? 'Колонка обновлена!' : 'Колонка удалена!' });
  emit('update:columns');
  closeModal();
};

const { isLoading: isLoadingUpdate, call: updateColumn } = useTryCatchFinally({
  callback: async () => {
    const body: TPatchColumn = {
      title: formData.value.title || undefined,
      description: formData.value.description || null,
      color: formData.value.color || undefined,
    };

    const result = await $fetch<TSuccessResponse>(`/api/boards/${route.params.id}/columns/${props.column.id}`, {
      method: 'PATCH',
      body,
    });
    if (result.isSuccess) onSuccessRequest('update');
  },
  catchCallback: (error: unknown) => {
    if (isValidationError(error)) formErrors.value = (error as TValidationErrorResponse<TPatchColumn>).validation;
    else toast.error({ message: getErrorMessage(error) });
  },
});

const { isLoading: isLoadingDelete, call: deleteColumn } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch<TSuccessResponse>(`/api/boards/${route.params.id}/columns/${props.column.id}`, {
      method: 'DELETE',
    });
    if (result.isSuccess) onSuccessRequest('delete');
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
