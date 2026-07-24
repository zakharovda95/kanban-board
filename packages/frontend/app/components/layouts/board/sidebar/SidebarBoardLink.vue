<template>
  <UILink
    :to="`/boards/${board.id}`"
    :hoverable="false"
    class="border-light-200 justify-right rounded-8 flex h-60 w-full flex-1 cursor-pointer items-center justify-between gap-8 border p-8 duration-300"
    :class="{ 'border-green!': board.id === Number(route.params?.id ?? 0) }"
  >
    <StopPreventWrapper>
      <DragArea />
    </StopPreventWrapper>

    <div class="w-[calc(100%-(16px+16px+24px))] text-left">
      <p class="text-14 block overflow-hidden font-medium text-ellipsis whitespace-nowrap">
        {{ board.title }}
      </p>
      <p class="text-12 block overflow-hidden font-light text-ellipsis whitespace-nowrap">
        {{ board.description }}
      </p>
    </div>

    <StopPreventWrapper>
      <BaseActionsButtons @update="isUpdateModalOpen = true" @delete="isDeleteModalOpen = true" />
    </StopPreventWrapper>

    <UpsertModal
      :is-open="isUpdateModalOpen"
      :form-errors="formErrors"
      :model-value="formData as TUpsertFormData"
      :title-maxlength="BOARD_TITLE_MAXLENGTH"
      :description-maxlength="BOARD_DESCRIPTION_MAXLENGTH"
      :is-loading="isLoadingUpdating"
      modal-title="Редактировать доску"
      @update:is-open="closeModal"
      @click:action-button="updateBoard"
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
  type TSuccessResponse,
  type TValidationErrorResponse,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import type { TBaseAction, TUpsertFormData } from '~/types/shared.types';
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
  'update:boards': [action: TBaseAction, id: number];
}>();

const toast = useToast();
const route = useRoute();

const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const closeModal = () => {
  isUpdateModalOpen.value = false;
  isDeleteModalOpen.value = false;
  reset();
};

const { formData, reset, formErrors } = useForm<TPatchBoard>({
  title: props.board.title,
  description: props.board?.description ?? '',
});

const { isLoading: isLoadingUpdating, call: updateBoard } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch<TSuccessResponse>(`/api/boards/${props.board.id}`, {
      method: 'PATCH',
      body: toBody<TPatchBoard>(formData.value),
    });

    if (result.isSuccess) {
      toast.success({ message: 'Доска обновлена!' });
      emit('update:boards', 'update', props.board.id);
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
    const result = await $fetch<TSuccessResponse>(`/api/boards/${props.board.id}`, {
      method: 'DELETE',
      body: toBody<TPatchBoard>(formData.value),
    });

    if (result.isSuccess) {
      toast.success({ message: 'Доска удалена!' });
      emit('update:boards', 'delete', props.board.id);
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
