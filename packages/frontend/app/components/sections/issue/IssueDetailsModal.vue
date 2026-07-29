<template>
  <UIModal v-model:is-open="isOpen">
    <template #header>
      <div class="flex flex-1 flex-col gap-8">
        <div class="flex w-full justify-between gap-12">
          <h4 class="text-18 flex items-center gap-4">
            <button
              class="text-green cursor-pointer bg-none p-0 font-bold underline underline-offset-4 duration-300 outline-none hover:brightness-95"
              @click="copyIssueId"
            >
              {{ issueNumber }}:
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

        <div class="text-14 flex items-center gap-8">
          <UIBadge :size="ESize.MEDIUM" :background-color="EColor.LIGHT_200" :color="EColor.LIGHT_800">
            Создано: <NuxtTime :datetime="issue.createdAt" />
            <span
              class="italic"
              :class="{
                'text-green!': daysPassedSinceCreation === 'сегодня',
                'text-orange!': daysPassedSinceCreation === 'вчера',
              }"
            >
              ({{ daysPassedSinceCreation }})
            </span>
          </UIBadge>

          <UIBadge :size="ESize.MEDIUM" :background-color="EColor.LIGHT_200" :color="EColor.LIGHT_800">
            Обновлено: <NuxtTime :datetime="issue.updatedAt" />
            <span
              class="italic"
              :class="{
                'text-green!': daysPassedSinceUpdating === 'сегодня',
                'text-orange!': daysPassedSinceUpdating === 'вчера',
              }"
            >
              ({{ daysPassedSinceUpdating }})
            </span>
          </UIBadge>
        </div>
      </div>
    </template>

    <div class="w-640 py-12">
      <div class="border-light-200 rounded-8 border p-12">
        <p v-if="issue.description">{{ issue.description }}</p>
        <p v-else class="text-light-500 italic">(описание не добавлено)</p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between gap-12">
        <UIButton
          :size="ESize.MEDIUM"
          :background-color="EColor.RED"
          prepend-icon="delete-2-line"
          @click:button="isOpenDeleteModal = true"
        >
          Удалить задачу
        </UIButton>
        <UIButton full :size="ESize.MEDIUM" :background-color="EColor.ORANGE" prepend-icon="pencil-line">
          Редактировать задачу
        </UIButton>
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
import { EColor, type TIssue, type TSuccessResponse } from '@kanban-board/common';

import { useIssueInfo } from '~/composables/app/use-issue-info.composable';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import { CONFIRMATION_MODAL_TEXT } from '~/constants/ui.constants';
import { ESize } from '~/enums/global.enums';
import { getErrorMessage } from '~/utilities/error.utilities';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';

const isOpen = defineModel<boolean>('isOpen', { required: true });

const props = defineProps<{
  issue: TIssue;
}>();

const emit = defineEmits<{
  'update:board': [];
}>();

const { issue } = toRefs(props);

const toast = useToast();

const { issueNumber, daysPassedSinceCreation, daysPassedSinceUpdating, copyIssueId, copyIssueLink, copyIssueTitle } =
  useIssueInfo(issue);

const isOpenDeleteModal = ref(false);

const closeModal = () => {
  isOpenDeleteModal.value = false;
  isOpen.value = false;
};

const { isLoading: isLoadingDelete, call: deleteIssue } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch<TSuccessResponse>(
      `/api/boards/${props.issue.boardId}/columns/${props.issue.columnId}/issues/${props.issue.id}`,
      { method: 'DELETE' },
    );

    if (result.isSuccess) {
      toast.success('Задача удалена!');
      emit('update:board');
      closeModal();
    }
  },
  catchCallback: (error: unknown) => {
    toast.error({ message: getErrorMessage(error) });
  },
});
</script>
