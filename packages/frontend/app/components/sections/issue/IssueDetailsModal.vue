<template>
  <UIModal v-model:is-open="isOpen">
    <template #header>
      <div class="flex flex-1 flex-col gap-8">
        <div v-if="!isUpdateMode" class="flex w-full justify-between gap-12">
          <h4 class="text-18 flex items-center gap-4">
            <button
              class="text-green cursor-pointer bg-none p-0 font-bold underline underline-offset-4 duration-300 outline-none hover:brightness-95"
              @click="copyIssueId"
            >
              {{ issueString }}:
            </button>
            <span class="font-bold">{{ issue.title }}</span>
          </h4>

          <div class="flex gap-8">
            <UIIconButton icon="copy-line" :size="ESize.MEDIUM" @click:button="copyIssueTitle" />
            <UIIconButton
              icon="share-2-line"
              :size="ESize.MEDIUM"
              :background-color="EColor.BLUE"
              @click:button="copyIssueLink"
            />
          </div>
        </div>
        <UILabel v-else text="Название задачи" required>
          <UIInput
            v-model="formData.title as string"
            name="issue-title"
            :size="ESize.MEDIUM"
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

    <div class="w-640 py-12">
      <div v-if="!isUpdateMode" class="border-light-200 rounded-8 border p-12">
        <p v-if="issue.description">{{ issue.description }}</p>
        <p v-else class="text-light-500 italic">(описание не добавлено)</p>
      </div>
      <UILabel v-else text="Описание">
        <UIRichEditor
          v-model="formData.description as string"
          name="issue-description"
          full
          placeholder="Введите описание задачи"
          :size="ESize.MEDIUM"
        />
      </UILabel>
    </div>

    <template #footer>
      <div class="flex justify-between gap-12">
        <template v-if="!isUpdateMode">
          <UIButton
            :size="ESize.MEDIUM"
            :background-color="EColor.RED"
            prepend-icon="delete-2-line"
            @click:button="isOpenDeleteModal = true"
          >
            Удалить задачу
          </UIButton>
          <UIButton
            full
            :size="ESize.MEDIUM"
            :background-color="EColor.ORANGE"
            prepend-icon="pencil-line"
            @click:button="isUpdateMode = true"
          >
            Редактировать задачу
          </UIButton>
        </template>
        <template v-else>
          <UIButton
            :size="ESize.MEDIUM"
            :background-color="EColor.RED"
            :disabled="isLoadingUpdate"
            @click:button="resetUpdating"
          >
            Отменить
          </UIButton>
          <UIButton
            full
            :size="ESize.MEDIUM"
            :background-color="EColor.ORANGE"
            :disabled="isLoadingUpdate || !isDirty"
            @click:button="updateIssue()"
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
  type TIssue,
  type TPatchIssue,
  type TSuccessResponse,
  type TValidationErrorResponse,
} from '@kanban-board/common';

import { useIssueInfo } from '~/composables/app/use-issue-info.composable';
import { useForm } from '~/composables/use-form.composable';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import { CONFIRMATION_MODAL_TEXT } from '~/constants/ui.constants';
import { ESize } from '~/enums/global.enums';
import { getErrorMessage, isValidationError } from '~/utilities/error.utilities';

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
  'update:board': [];
  'update:issue': [];
}>();

const { issue } = toRefs(props);

const toast = useToast();

const isUpdateMode = ref(false);

const { issueString, daysPassedSinceCreation, daysPassedSinceUpdating, copyIssueId, copyIssueLink, copyIssueTitle } =
  useIssueInfo(issue);

const isOpenDeleteModal = ref(false);

const closeModal = () => {
  isOpenDeleteModal.value = false;
  isOpen.value = false;
};

const { formData, formErrors, isDirty, reset } = useForm<TPatchIssue>({
  title: props.issue?.title ?? '',
  description: props.issue?.description ?? '',
});

const { call: updateIssue, isLoading: isLoadingUpdate } = useTryCatchFinally({
  callback: async () => {
    const body: TPatchIssue = {
      title: formData.value?.title || undefined,
      description: formData.value?.description || null,
    };
    const result = await $fetch<TSuccessResponse>(`/api/issues/${issue.value.id}`, { method: 'PATCH', body });
    if (result.isSuccess) {
      emit('update:issue');
      emit('update:board');
      toast.success({ message: 'Задача обновлена!' });
      resetUpdating();
    }
  },
  catchCallback: (error: unknown) => {
    if (isValidationError(error)) formErrors.value = (error as TValidationErrorResponse<TPatchIssue>)?.validation;
    else toast.error({ message: getErrorMessage(error) });
  },
});

const resetUpdating = () => {
  isUpdateMode.value = false;
  reset();
};

const { isLoading: isLoadingDelete, call: deleteIssue } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch<TSuccessResponse>(`/api/issues/${issue.value.id}`, { method: 'DELETE' });

    if (result.isSuccess) {
      toast.success({ message: 'Задача удалена!' });
      emit('update:board');
      closeModal();
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});

onBeforeUnmount(() => {
  resetUpdating();
});
</script>
