<template>
  <div class="size-fit">
    <ActionsButtons :actions="actions" :grid-template-columns="4" />

    <UpsertModal
      :is-open="isUpdateModalOpen"
      modal-title="Редактировать колонку"
      action-button-label="Редактировать колонку"
      :model-value="formData as TUpsertFormData"
      :form-errors="formErrors as TValidationErrors<TUpsertFormData>"
      :disabled="isLoadingUpdate || !isDirty"
      :title-maxlength="COLUMN_TITLE_MAXLENGTH"
      :description-maxlength="COLUMN_DESCRIPTION_MAXLENGTH"
      show-color-picker
      body-class="w-320!"
      @click:action-button="updateColumn"
      @update:is-open="closeModal"
      @update:field="update"
    />

    <UIConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Удалить колонку?"
      :text="CONFIRMATION_MODAL_TEXT"
      action-button-label="Да, удалить колонку"
      :disabled="isLoadingDelete"
      @click:confirm="deleteColumn"
      @update:is-open="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import {
  COLUMN_DESCRIPTION_MAXLENGTH,
  COLUMN_TITLE_MAXLENGTH,
  EColumnEvent,
  getErrorMessage,
  isValidationError,
  type TColumn,
  type TColumnBase,
  type TDeleteColumnEmitPayload,
  type TDeleteColumnResponse,
  type TMoveColumn,
  type TMoveColumnEmitPayload,
  type TMoveColumnResponse,
  type TUpdateColumn,
  type TUpdateColumnResponse,
  type TValidationErrors,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable.ts';
import { useSocket } from '~/composables/use-socket.composable.ts';
import { ACTIONS_BUTTONS_DATA } from '~/constants/shared.constants.ts';
import { CONFIRMATION_MODAL_TEXT } from '~/constants/ui.constants.ts';
import type { TActionButtonData, TUpsertFormData } from '~/types/shared.types.ts';

import ActionsButtons from '~/components/shared/ActionsButtons.vue';
import UpsertModal from '~/components/shared/UpsertModal.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';

const props = defineProps<{
  columnId: number;
  columns: TColumn[];
}>();

const emit = defineEmits<{
  'update:column': [payload: TColumnBase];
  'delete:column': [payload: TDeleteColumnEmitPayload];
  'move:column': [payload: TMoveColumnEmitPayload];
}>();

const toast = useToast();

const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const column = computed(() => props.columns.find(({ id }) => id === props.columnId) ?? null);
const columnIndex = computed(() => props.columns.findIndex(({ id }) => id === props.columnId));

const isOnlyOneColumn = computed(() => props.columns.length <= 1);
const isFirstColumn = computed(() => columnIndex.value <= 0);
const isLastColumn = computed(() => columnIndex.value === -1 || columnIndex.value === props.columns.length - 1);

const cannotMoveBackward = computed(() => isOnlyOneColumn.value || isFirstColumn.value);
const cannotMoveForward = computed(() => isOnlyOneColumn.value || isLastColumn.value);

const actions = computed<TActionButtonData[]>(() => [
  {
    ...ACTIONS_BUTTONS_DATA.moveToStart,
    handler: moveToStart,
    disabled: cannotMoveBackward.value || isLoadingMove.value,
  },
  {
    ...ACTIONS_BUTTONS_DATA.moveToPrevious,
    handler: moveToPrevious,
    disabled: cannotMoveBackward.value || isLoadingMove.value,
  },
  {
    ...ACTIONS_BUTTONS_DATA.moveToNext,
    handler: moveToNext,
    disabled: cannotMoveForward.value || isLoadingMove.value,
  },
  {
    ...ACTIONS_BUTTONS_DATA.moveToEnd,
    handler: moveToEnd,
    disabled: cannotMoveForward.value || isLoadingMove.value,
  },
  {
    ...ACTIONS_BUTTONS_DATA.update,
    handler: () => openUpdateModal(),
    disabled: isUpdateModalOpen.value || isDeleteModalOpen.value,
  },
  {
    ...ACTIONS_BUTTONS_DATA.delete,
    handler: () => openDeleteModal(),
    disabled: isUpdateModalOpen.value || isDeleteModalOpen.value,
  },
]);

const getInitialValue = (): Omit<TUpdateColumn, 'id'> => ({
  title: column.value?.title ?? '',
  description: column.value?.description ?? '',
  color: column.value?.color ?? '',
});

const { formData, formErrors, reset, isDirty, set, update } = useForm<Omit<TUpdateColumn, 'id'>>(getInitialValue());
const { emitEvent: emitEventUpdate, isLoading: isLoadingUpdate } = useSocket();
const { emitEvent: emitEventDelete, isLoading: isLoadingDelete } = useSocket();
const { emitEvent: emitEventMove, isLoading: isLoadingMove } = useSocket();

const updateColumn = () => {
  if (!column.value) return;

  const body: TUpdateColumn = {
    id: column.value.id,
    ...formData.value,
  };

  emitEventUpdate<TUpdateColumn, TUpdateColumnResponse>({
    event: EColumnEvent.UPDATE,
    data: body,
    successCallback: (response: TUpdateColumnResponse) => {
      if (response.isSuccess && response.data) {
        toast.success({ message: 'Колонка обновлена' });
        emit('update:column', response.data);
        closeModal();
      }
    },
    errorCallback: (error: unknown) => {
      if (isValidationError(error)) formErrors.value = error.validation;
      else toast.error({ message: getErrorMessage(error) });
    },
  });
};

const deleteColumn = () => {
  if (!column.value) return;

  emitEventDelete<number, TDeleteColumnResponse>({
    event: EColumnEvent.DELETE,
    data: column.value.id,
    successCallback: (response: TDeleteColumnResponse) => {
      if (response.isSuccess && response.data) {
        toast.success({ message: 'Колонка удалена' });
        emit('delete:column', response.data);
        closeModal();
      }
    },
    errorCallback: (error: unknown) => {
      toast.error({ message: getErrorMessage(error) });
    },
  });
};

const moveColumn = (previousId: number | null) => {
  if (!column.value) return;

  const body: TMoveColumn = {
    boardId: column.value.boardId,
    targetId: column.value.id,
    previousId,
  };

  emitEventMove<TMoveColumn, TMoveColumnResponse>({
    event: EColumnEvent.MOVE,
    data: body,
    successCallback: (response: TMoveColumnResponse) => {
      if (response.isSuccess && response.data) {
        toast.success({ message: 'Колонка перемещена' });
        emit('move:column', response.data);
      }
    },
    errorCallback: (error: unknown) => {
      toast.error({ message: getErrorMessage(error) });
    },
  });
};

const moveToStart = () => {
  if (cannotMoveBackward.value) return;
  moveColumn(null);
};

const moveToPrevious = () => {
  if (cannotMoveBackward.value) return;
  moveColumn(props.columns[columnIndex.value - 2]?.id ?? null);
};

const moveToNext = () => {
  const previousId = props.columns[columnIndex.value + 1]?.id;
  if (cannotMoveForward.value || !previousId) return;
  moveColumn(previousId);
};

const moveToEnd = () => {
  const lastColumnId = props.columns[props.columns.length - 1]?.id;
  if (cannotMoveForward.value || !lastColumnId) return;
  moveColumn(lastColumnId);
};

const openUpdateModal = () => {
  set(getInitialValue(), { setAsInitial: true, clearErrors: true });
  isUpdateModalOpen.value = true;
};

const openDeleteModal = () => {
  isDeleteModalOpen.value = true;
};

const closeModal = () => {
  isUpdateModalOpen.value = false;
  isDeleteModalOpen.value = false;
  reset();
};
</script>
