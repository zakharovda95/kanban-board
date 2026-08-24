<template>
  <UIModal :is-open="isOpen" body-class="laptop:w-640 w-full" @update:is-open="closeModal">
    <template #header>
      <div class="flex flex-1 flex-col gap-8">
        <div v-if="!isUpdateMode" class="flex w-full justify-between gap-12">
          <h4 class="text-18 flex flex-wrap items-center gap-4">
            <button
              class="text-green cursor-pointer bg-none p-0 font-bold whitespace-nowrap underline underline-offset-4 duration-300 outline-none hover:brightness-95"
              @click="copyIssueId"
            >
              {{ issueString }}:
            </button>
            <span class="font-bold">{{ issue.title }}</span>
          </h4>

          <div class="flex gap-8">
            <UIIconButton icon="mingcute:copy-line" @click:button="copyIssueTitle" />
            <UIIconButton icon="mingcute:share-2-line" :background-color="EColor.BLUE" @click:button="copyIssueLink" />
          </div>
        </div>
        <UILabel v-else text="Название задачи" required>
          <UIInput
            v-model="formData.title as string"
            name="issue-title"
            :max-length="ISSUE_TITLE_MAXLENGTH"
            full
            placeholder="Введите название задачи"
          />
        </UILabel>

        <IssueDate
          variant="details"
          :created-at="issue.createdAt"
          :updated-at="issue.updatedAt"
          :days-passed-since-creation="daysPassedSinceCreation"
          :days-passed-since-updating="daysPassedSinceUpdating"
        />
      </div>
    </template>

    <div class="border-light-200 rounded-8 border p-12">
      <template v-if="!isUpdateMode">
        <div v-if="issue.description" v-html="issue.description" />
        <p v-else class="text-light-500 text-14 italic">(описание не добавлено)</p>
      </template>
      <UILabel v-else text="Описание" tag="div">
        <UIRichEditor
          v-model="formData.description as string"
          name="issue-description"
          full
          placeholder="Введите описание задачи..."
        />
      </UILabel>
    </div>

    <template #footer>
      <div class="laptop:gap-12 laptop:flex-row flex flex-col-reverse items-center justify-between gap-8">
        <template v-if="!isUpdateMode">
          <UIButton
            class="laptop:w-fit w-full"
            :background-color="EColor.RED"
            prepend-icon="mingcute:delete-2-line"
            @click:button="isOpenDeleteModal = true"
          >
            Удалить задачу
          </UIButton>
          <UIButton
            class="laptop:w-auto laptop:flex-1 w-full"
            :background-color="EColor.ORANGE"
            prepend-icon="mingcute:pencil-line"
            @click:button="startUpdateMode"
          >
            Редактировать задачу
          </UIButton>
        </template>
        <template v-else>
          <UIButton
            class="laptop:w-fit w-full"
            :background-color="EColor.RED"
            :disabled="isLoadingUpdate"
            @click:button="resetUpdating"
          >
            Отменить
          </UIButton>
          <UIButton
            class="laptop:w-auto laptop:flex-1 w-full"
            :background-color="EColor.ORANGE"
            :disabled="isLoadingUpdate || !isDirty"
            @click:button="updateIssue"
          >
            Применить
          </UIButton>
        </template>
      </div>

      <UIConfirmationModal
        v-model:is-open="isOpenDeleteModal"
        title="Удалить задачу?"
        :text="CONFIRMATION_MODAL_TEXT"
        action-button-label="Да, удалить задачу"
        :disabled="isLoadingDelete"
        @click:confirm="deleteIssue"
        @click:reset="isOpenDeleteModal = false"
      />
    </template>
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
  type TUpdateIssue,
  type TUpsertIssueResponse,
} from '@kanban-board/common';

import { useIssueInfo } from '~/composables/app/use-issue-info.composable';
import { useForm } from '~/composables/use-form.composable';
import { useSocket } from '~/composables/use-socket.composable.ts';
import { ISSUE_MESSAGES } from '~/constants/issue.constants.ts';
import { CONFIRMATION_MODAL_TEXT } from '~/constants/ui.constants';

import IssueDate from '~/components/sections/issue/IssueDate.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';
import UILabel from '~/components/ui/UILabel.vue';
import UIRichEditor from '~/components/ui/UIRichEditor.vue';

const isOpen = defineModel<boolean>('isOpen', { required: true });

const props = defineProps<{
  issue: TIssue;
}>();

const emit = defineEmits<{
  'update:issue': [payload: TIssueBase];
  'delete:issue': [payload: TDeleteIssueEmitPayload];
}>();

const { issue } = toRefs(props);

const toast = useToast();

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
        toast.success({ message: ISSUE_MESSAGES.issueUpdated });
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
        toast.success({ message: ISSUE_MESSAGES.issueDeleted });
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

onBeforeUnmount(() => {
  resetUpdating();
});
</script>
