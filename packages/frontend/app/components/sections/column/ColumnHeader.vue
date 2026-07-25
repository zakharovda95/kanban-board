<template>
  <header
    class="bg-light-base flex h-52 w-full flex-col border-b-4 p-8 text-left"
    :style="{ borderBottomColor: column.color }"
  >
    <div class="flex size-full flex-nowrap items-center justify-between gap-8">
      <DragArea />

      <div class="flex flex-1 items-center justify-between gap-8">
        <div class="h-full flex-1 overflow-hidden">
          <p class="text-14 font-medium text-ellipsis whitespace-nowrap">{{ column.title }}</p>
          <p class="text-elipsis text-12 w-full overflow-hidden font-light">
            {{ column.description }}
          </p>
        </div>

        <BaseActionsButtons @update="isUpdateModalOpen = true" @delete="isDeleteModalOpen = true" />
      </div>
    </div>

    <UpsertModal
      modal-title="Редактировать колонку"
      :form-errors="formErrors"
      :is-open="isUpdateModalOpen"
      :is-loading="isLoadingUpdate"
      :model-value="formData as TUpsertFormData"
      @click:action-button="updateColumn"
      @update:is-open="closeModal"
    >
      <UILabel text="Цвет">
        <UIColorPicker v-model="formData.color!" />
      </UILabel>
    </UpsertModal>

    <UIConfirmationModal
      title="Удалить колонку?"
      :is-open="isDeleteModalOpen"
      :is-loading="isLoadingDelete"
      text="Восстановить данные будет невозможно!"
      action-button-label="Да, удалить колонку"
      @click:confirm="deleteColumn"
      @update:is-open="closeModal"
    />
  </header>
</template>

<script setup lang="ts">
import type { TColumn, TPatchColumn, TSuccessResponse, TValidationErrorResponse } from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import type { TBaseAction, TUpsertFormData } from '~/types/shared.types';
import { getErrorMessage, isValidationError } from '~/utilities/error.utilities';
import { toBody } from '~/utilities/object.utilities';

import BaseActionsButtons from '~/components/shared/BaseActionsButtons.vue';
import DragArea from '~/components/shared/DragArea.vue';
import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';
import UIColorPicker from '~/components/ui/UIColorPicker.vue';
import UILabel from '~/components/ui/UILabel.vue';

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

const { formData, formErrors, reset } = useForm<TPatchColumn>({
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
    const result = await $fetch<TSuccessResponse>(`/api/boards/${route.params.id}/columns/${props.column.id}`, {
      method: 'PATCH',
      body: toBody<TPatchColumn>(formData.value),
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
