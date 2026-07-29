<template>
  <article
    class="issue-card rounded-8 bg-light-base group flex h-fit w-full cursor-pointer flex-col gap-8 border border-transparent p-8 duration-300 select-none"
    @click="isModalOpen = true"
  >
    <header class="flex w-full justify-between gap-8">
      <div class="flex flex-col gap-8">
        <div class="flex gap-4">
          <StopPreventWrapper>
            <UIBadge
              class="cursor-pointer"
              :background-color="color"
              :color="color ? ColorUtility.getTextColor(color, 170) : EColor.LIGHT_BASE"
              append-icon="copy-line"
              @click:badge="copyIssueId"
            >
              {{ issueNumber }}
            </UIBadge>
          </StopPreventWrapper>

          <UIBadge v-if="false" :background-color="EColor.RED">Просрочена</UIBadge>
        </div>

        <div class="text-12 text-light-800 flex gap-2">
          <NuxtTime
            :datetime="issue.createdAt"
            class="font-medium tabular-nums"
            day="numeric"
            month="numeric"
            year="numeric"
          />
          <span
            class="italic"
            :class="{
              'text-green!': daysPassedSinceCreation === 'сегодня',
              'text-orange!': daysPassedSinceCreation === 'вчера',
            }"
          >
            ({{ daysPassedSinceCreation }})
          </span>
        </div>
      </div>

      <StopPreventWrapper>
        <BaseActionsButtons
          :actions="['copy', 'share']"
          :button-background-color="EColor.LIGHT_BASE"
          @copy="copyIssueTitle"
          @share="copyIssueLink"
        />
      </StopPreventWrapper>
    </header>

    <div>
      <h4 class="text-14 cursor-text font-medium select-text">{{ issue.title }}</h4>
    </div>

    <IssueDetailsModal v-model:is-open="isModalOpen" :issue="issue" @update:board="emit('update:board')" />
  </article>
</template>

<script setup lang="ts">
import { ColorUtility, EColor, type TIssue } from '@kanban-board/common';

import { useIssueInfo } from '~/composables/app/use-issue-info.composable';

import IssueDetailsModal from '~/components/sections/issue/IssueDetailsModal.vue';
import BaseActionsButtons from '~/components/shared/BaseActionsButtons.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';

const props = withDefaults(
  defineProps<{
    color?: string;
    issue: TIssue;
  }>(),
  {
    color: EColor.GREEN,
  },
);

const emit = defineEmits<{
  'update:board': [];
}>();

const { issue } = toRefs(props);

const isModalOpen = ref(false);

const computedColor = computed(() => props.color || EColor.GREEN);

const { issueNumber, daysPassedSinceCreation, copyIssueId, copyIssueTitle, copyIssueLink } = useIssueInfo(issue);
</script>

<style scoped>
.issue-card:hover {
  border-color: v-bind(computedColor);
}
</style>
