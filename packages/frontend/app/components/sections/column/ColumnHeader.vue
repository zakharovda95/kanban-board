<template>
  <header
    class="bg-light-base flex h-60 w-full flex-col border-b-4 p-8 text-left"
    :style="{ borderBottomColor: column.color }"
  >
    <div class="flex w-full flex-row flex-nowrap items-center justify-between gap-4 overflow-hidden">
      <span class="text-14 font-medium text-ellipsis whitespace-nowrap">{{ column.title }}</span>
      <BaseActionsButtons @update="isUpdateModalOpen = true" @delete="isDeleteModalOpen = true" />

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
    </div>
    <span class="text-elipsis text-12 w-full overflow-hidden font-light">
      {{ column.description }}
    </span>
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
import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';
import UIColorPicker from '~/components/ui/UIColorPicker.vue';
import UILabel from '~/components/ui/UILabel.vue';

const props = defineProps<{ column: TColumn }>();

const emit = defineEmits<{
  'update:column': [action: TBaseAction, id: number];
}>();

const toast = useToast();

const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const { formData, formErrors, reset } = useForm<TPatchColumn>({
  title: props.column.title ?? '',
  description: props.column.description ?? '',
  color: props.column.color ?? '',
});

const { isLoading: isLoadingUpdate, call: updateColumn } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch<TSuccessResponse>(`/api/columns/${props.column.id}`, {
      method: 'PATCH',
      body: toBody<TPatchColumn>(formData.value),
    });

    if (result.isSuccess) {
      toast.success({ message: 'Колонка обновлена!' });
      emit('update:column', 'update', props.column.id);
      closeModal();
    }
  },
  catchCallback: (error: unknown) => {
    if (isValidationError(error)) formErrors.value = (error as TValidationErrorResponse<TPatchColumn>).validation;
    else toast.error({ message: getErrorMessage(error) });
  },
});

const { isLoading: isLoadingDelete, call: deleteColumn } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch<TSuccessResponse>(`/api/columns/${props.column.id}`, { method: 'DELETE' });

    if (result.isSuccess) {
      toast.success({ message: 'Колонка удалена!' });
      emit('update:column', 'delete', props.column.id);
      closeModal();
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});

const closeModal = () => {
  isUpdateModalOpen.value = false;
  isDeleteModalOpen.value = false;
  reset();
};
</script>
