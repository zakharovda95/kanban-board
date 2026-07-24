<template>
  <UILink
    :to="`/boards/${board.id}`"
    :hoverable="false"
    class="border-light-200 justify-right rounded-8 flex h-60 w-full flex-1 cursor-pointer items-center justify-between gap-4 border p-8 duration-300"
    :class="{ 'border-green!': board.id === Number(route.params?.id ?? 0) }"
  >
    <StopPreventWrapper>
      <DragArea />
    </StopPreventWrapper>

    <div class="flex w-[calc(100%-(16px+8px+24px))] flex-col gap-4 text-left">
      <span class="text-14 block overflow-hidden font-medium text-ellipsis whitespace-nowrap">
        {{ board.title }}
      </span>
      <span class="text-12 block overflow-hidden font-light text-ellipsis whitespace-nowrap">
        {{ board.description }}
      </span>
    </div>

    <StopPreventWrapper>
      <BaseActionsButtons @edit="isEditModalOpen = true" @delete="isDeleteModalOpen = true" />
    </StopPreventWrapper>

    <UpsertModal
      :is-open="isEditModalOpen"
      :form-errors="formErrors"
      :model-value="formData as TUpsertFormData"
      :title-maxlength="BOARD_TITLE_MAXLENGTH"
      :description-maxlength="BOARD_DESCRIPTION_MAXLENGTH"
      :is-loading="isLoadingEditing"
      modal-title="Редактировать доску"
      @update:is-open="closeModal"
      @click:action-button="editBoard"
    />
    <UIConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Удалить доску?"
      text="Восстановить данные будет невозможно!"
      action-button-label="Да, удалить доску"
      :close-on-overlay="false"
      :is-loading="isLoadingDeleting"
      @update:is-open="closeModal"
      @click:confirm="deleteBoard"
    />
  </UILink>
</template>

<script setup lang="ts">
import {
  BOARD_DESCRIPTION_MAXLENGTH,
  BOARD_TITLE_MAXLENGTH,
  type TBoardBase,
  type TCreateBoard,
  type TPatchBoard,
  type TValidationErrorResponse,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import type { TUpsertFormData } from '~/types/shared.types';
import { getErrorMessage, isValidationError } from '~/utilities/error.utilities';
import { toBody } from '~/utilities/object.utilities';

import BaseActionsButtons from '~/components/shared/BaseActionsButtons.vue';
import DragArea from '~/components/shared/DragArea.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';
import UpsertModal from '~/components/shared/UpsertModal.vue';
import UILink from '~/components/ui/links/UILink.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';

const props = defineProps<{
  board: TBoardBase;
}>();

const emit = defineEmits<{
  'update:boards': [];
}>();

const toast = useToast();
const route = useRoute();

const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const closeModal = () => {
  isEditModalOpen.value = false;
  isDeleteModalOpen.value = false;
  reset();
};

const { formData, reset, formErrors } = useForm<TPatchBoard>({
  title: props.board.title,
  description: props.board?.description ?? '',
});

const { isLoading: isLoadingEditing, call: editBoard } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch(`/api/boards/${props.board.id}`, {
      method: 'PATCH',
      body: toBody<TPatchBoard>(formData.value),
    });

    if (result.isSuccess) {
      toast.success({ message: 'Доска обновлена!' });
      emit('update:boards');
      reset();
    }
  },
  catchCallback: (error: unknown) => {
    if (isValidationError(error)) formErrors.value = (error as TValidationErrorResponse<TCreateBoard>).validation;
    else toast.error({ message: getErrorMessage(error) });
  },
});

const { isLoading: isLoadingDeleting, call: deleteBoard } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch(`/api/boards/${props.board.id}`, {
      method: 'DELETE',
      body: toBody<TPatchBoard>(formData.value),
    });

    if (result.isSuccess) {
      toast.success({ message: 'Доска удалена!' });
      emit('update:boards');
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
