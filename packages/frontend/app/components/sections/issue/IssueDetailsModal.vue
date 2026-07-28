<template>
  <UIModal v-model:is-open="isOpen">
    <template #header>
      <div class="flex w-full justify-between gap-12">
        <div class="flex flex-1 flex-col gap-12">
          <h4 class="text-18 flex items-center gap-4">
            <button
              class="text-green cursor-pointer bg-none p-0 font-bold underline underline-offset-4 duration-300 outline-none hover:brightness-95"
              @click="copyIssueId"
            >
              {{ issueNumber }}:
            </button>
            <span class="font-bold">{{ issue.title }}</span>
          </h4>

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
                  'text-green!': daysPassedSinceCreation === 'сегодня',
                  'text-orange!': daysPassedSinceCreation === 'вчера',
                }"
              >
                ({{ daysPassedSinceUpdating }})
              </span>
            </UIBadge>
          </div>
        </div>

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
    </template>

    <div class="w-640 py-12">
      <div class="border-light-200 rounded-8 border p-12">
        <p v-if="issue.description">{{ issue.description }}</p>
        <p v-else class="text-light-500 italic">(описание не добавлено)</p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between gap-12">
        <UIButton :size="ESize.MEDIUM" :background-color="EColor.RED" prepend-icon="delete-2-line">
          Удалить задачу
        </UIButton>
        <UIButton full :size="ESize.MEDIUM" :background-color="EColor.ORANGE" prepend-icon="pencil-line">
          Редактировать задачу
        </UIButton>
      </div>
    </template>
  </UIModal>
</template>

<script setup lang="ts">
import { EColor, type TIssue } from '@kanban-board/common';

import { useIssueInfo } from '~/composables/app/use-issue-info.composable';
import { ESize } from '~/enums/global.enums';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';

const isOpen = defineModel<boolean>('isOpen', { required: true });

const props = defineProps<{
  issue: TIssue;
}>();

const { issue } = toRefs(props);

const { issueNumber, daysPassedSinceCreation, daysPassedSinceUpdating, copyIssueId, copyIssueLink, copyIssueTitle } =
  useIssueInfo(issue);
</script>
