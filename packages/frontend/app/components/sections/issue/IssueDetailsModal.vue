<template>
  <UIModal
    :is-open="isOpen"
    :body-class="`w-full ${isUpdateMode ? 'max-w-640!' : 'max-width'}`"
    @update:is-open="closeModal"
  >
    <template #header>
      <div class="mr-12 flex w-full flex-1 justify-between gap-8">
        <h4 class="text-18 font-bold">
          <span
            class="text-green cursor-pointer bg-none p-0 font-bold whitespace-nowrap underline underline-offset-4 duration-300 outline-none hover:brightness-95"
            @click="copyIssueId"
          >
            {{ issueString }}:
          </span>
          {{ issue.title }}
        </h4>
        <div v-if="!isUpdateMode" class="flex gap-4">
          <UIIconButton icon="mingcute:copy-line" size="small" @click:button="copyIssueTitle" />
          <UIIconButton
            icon="mingcute:share-2-line"
            :background-color="EColor.BLUE"
            size="small"
            @click:button="copyIssueLink"
          />
        </div>
      </div>
    </template>

    <div class="laptop:flex-row flex w-full flex-col justify-between gap-24">
      <IssueDate
        v-if="!isUpdateMode"
        class="laptop:hidden flex"
        variant="details"
        :created-at="issue.createdAt"
        :updated-at="issue.updatedAt"
        :days-passed-since-creation="daysPassedSinceCreation"
        :days-passed-since-updating="daysPassedSinceUpdating"
      />

      <div class="flex-1">
        <div v-if="!isUpdateMode" class="bg-light-100 rounded-8 h-full p-12">
          <OverlayScrollbarsComponent v-if="issue.description" :options="scrollbarOptions">
            <div class="max-h-[50vh]" v-html="issue.description" />
          </OverlayScrollbarsComponent>
          <p v-else class="text-light-500 text-14 italic">(описание не добавлено)</p>
        </div>
        <UIForm
          v-else
          full
          :disabled="isLoadingUpdate || !isDirty"
          buttons-position="row"
          @submit:form="updateIssue"
          @reset:form="resetUpdating"
        >
          <UILabel text="Название задачи" required>
            <UIInput
              v-model="formData.title as string"
              name="issue-title"
              :max-length="ISSUE_TITLE_MAXLENGTH"
              full
              placeholder="Введите название задачи"
            />
          </UILabel>
          <UILabel text="Описание" tag="div">
            <UIRichEditor
              v-model="formData.description as string"
              name="issue-description"
              full
              placeholder="Введите описание задачи..."
              editor-class="max-h-[50vh]"
            />
          </UILabel>
        </UIForm>
      </div>

      <div v-if="!isUpdateMode" class="laptop:max-w-320 flex w-full max-w-none flex-col justify-between gap-24">
        <div class="flex flex-col gap-8">
          <UILabel text="Этап" required>
            <UISelect
              v-if="currentStage && stages.length"
              v-model="currentStage"
              name="issue-stage-select"
              placeholder="Выберите значение"
              :options="stages"
            />
          </UILabel>
          <IssueDate
            class="laptop:flex hidden"
            variant="details"
            :created-at="issue.createdAt"
            :updated-at="issue.updatedAt"
            :days-passed-since-creation="daysPassedSinceCreation"
            :days-passed-since-updating="daysPassedSinceUpdating"
          />
        </div>

        <div class="flex flex-col gap-8">
          <UIButton
            full
            :background-color="EColor.ORANGE"
            prepend-icon="mingcute:pencil-line"
            @click:button="startUpdateMode"
          >
            Редактировать задачу
          </UIButton>
          <UIButton
            full
            :background-color="EColor.RED"
            prepend-icon="mingcute:delete-2-line"
            @click:button="isOpenDeleteModal = true"
          >
            Удалить задачу
          </UIButton>
        </div>

        <UIConfirmationModal
          v-model:is-open="isOpenDeleteModal"
          title="Удалить задачу?"
          text="Восстановить данные будет невозможно!"
          action-button-label="Да, удалить задачу"
          :disabled="isLoadingDelete"
          @click:confirm="deleteIssue"
          @click:reset="isOpenDeleteModal = false"
        />
      </div>
    </div>
  </UIModal>
</template>

<script setup lang="ts">
import {
  EColor,
  EIssueEvent,
  getErrorMessage,
  ISSUE_TITLE_MAXLENGTH,
  isValidationError,
  type TDeleteIssueEmitPayload,
  type TDeleteIssueResponse,
  type TIssue,
  type TIssueBase,
  type TMoveIssue,
  type TUpdateIssue,
  type TUpsertIssueResponse,
} from '@kanban-board/common';
import { OverlayScrollbarsComponent, type OverlayScrollbarsComponentProps } from 'overlayscrollbars-vue';

import { useIssueInfo } from '~/composables/app/use-issue-info.composable.ts';
import { useForm } from '~/composables/use-form.composable.ts';
import { useSocket } from '~/composables/use-socket.composable.ts';
import type { TUISelectOption } from '~/types/ui.types.ts';

import IssueDate from '~/components/sections/issue/IssueDate.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';
import UILabel from '~/components/ui/UILabel.vue';
import UIRichEditor from '~/components/ui/UIRichEditor.vue';
import UISelect from '~/components/ui/UISelect.vue';

const isOpen = defineModel<boolean>('isOpen', { required: true });

const props = defineProps<{
  issue: TIssue;
  stages: TUISelectOption[];
}>();

const emit = defineEmits<{
  'update:issue': [payload: TIssueBase];
  'delete:issue': [payload: TDeleteIssueEmitPayload];
  'change:stage': [payload: TMoveIssue];
}>();

const { issue } = toRefs(props);

const toast = useToast();

const currentStage = computed({
  get: () => props.stages?.find(({ id }) => id === props.issue.columnId) ?? props.stages?.[0],
  set: (option: TUISelectOption) => {
    const payload: TMoveIssue = {
      targetId: props.issue.id,
      previousId: null,
      boardId: props.issue.boardId,
      fromColumnId: props.issue.columnId,
      toColumnId: option.id,
    };
    emit('change:stage', payload);
  },
});

const isOpenDeleteModal = ref(false);
const isUpdateMode = ref(false);

const { issueString, daysPassedSinceCreation, daysPassedSinceUpdating, copyIssueId, copyIssueLink, copyIssueTitle } =
  useIssueInfo(issue);

const getInitialValue = (): Omit<TUpdateIssue, 'id'> => ({
  title: props.issue?.title ?? '',
  description: props.issue?.description ?? '',
});

const { formData, formErrors, isDirty, reset, set } = useForm<Omit<TUpdateIssue, 'id'>>(getInitialValue());
const { emitEvent: emitEventUpdate, isLoading: isLoadingUpdate } = useSocket();
const { emitEvent: emitEventDelete, isLoading: isLoadingDelete } = useSocket();

const updateIssue = () => {
  const body: TUpdateIssue = {
    id: issue.value.id,
    ...formData.value,
  };

  emitEventUpdate({
    event: EIssueEvent.UPDATE,
    data: body,
    successCallback: (response: TUpsertIssueResponse) => {
      if (response.isSuccess && response.data) {
        emit('update:issue', response.data);
        toast.success({ message: 'Задача обновлена' });
        resetUpdating();
      }
    },
    errorCallback: (error: unknown) => {
      if (isValidationError(error)) formErrors.value = error.validation;
      else toast.error({ message: getErrorMessage(error) });
    },
  });
};

const deleteIssue = () => {
  emitEventDelete({
    event: EIssueEvent.DELETE,
    data: issue.value.id,
    successCallback: (response: TDeleteIssueResponse) => {
      if (response.isSuccess && response.data) {
        emit('delete:issue', response.data);
        toast.success({ message: 'Задача удалена' });
        closeModal();
      }
    },
    errorCallback: (error: unknown) => {
      toast.error({ message: getErrorMessage(error) });
    },
  });
};

const resetUpdating = () => {
  isUpdateMode.value = false;
  reset();
};

const closeModal = () => {
  isOpenDeleteModal.value = false;
  isOpen.value = false;
  resetUpdating();
};

const startUpdateMode = () => {
  isUpdateMode.value = true;
  set(getInitialValue(), { setAsInitial: true, clearErrors: true });
};

const scrollbarOptions: OverlayScrollbarsComponentProps['options'] = {
  overflow: { x: 'hidden' },
  scrollbars: {
    autoHide: 'leave',
    autoHideDelay: 300,
    theme: 'os-theme-modal',
  },
};

onBeforeUnmount(() => {
  resetUpdating();
});
</script>
