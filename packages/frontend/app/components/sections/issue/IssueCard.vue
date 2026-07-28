<template>
  <article
    class="issue-card rounded-8 bg-light-base group flex h-fit w-full cursor-pointer flex-col gap-8 border border-transparent p-8 duration-300 select-none"
  >
    <header class="flex w-full justify-between gap-8">
      <div class="flex flex-col gap-4">
        <UIBadge
          :background-color="color"
          :color="color ? ColorUtility.getTextColor(color, 170) : EColor.LIGHT_BASE"
          append-icon="copy-line"
          @click:badge="copyIssueId"
        >
          {{ issueNumber }}
        </UIBadge>

        <div class="text-12 flex gap-2">
          <NuxtTime
            :datetime="issue.createdAt"
            class="font-medium tabular-nums"
            day="numeric"
            month="numeric"
            year="numeric"
          />
          <span class="italic">(12 дня)</span>
        </div>
      </div>

      <StopPreventWrapper class="hidden duration-300 group-hover:block">
        <BaseActionsButtons />
      </StopPreventWrapper>
    </header>

    <div>
      <h4 class="text-14 cursor-text font-medium select-text">{{ issue.title }}</h4>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ColorUtility, EColor, type TIssue } from '@kanban-board/common';

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

const toast = useToast();

const computedColor = computed(() => props.color || EColor.GREEN);
const issueNumber = computed(() => `task-${props.issue.id}`);

const { copy } = useClipboard();

const copyIssueId = () => {
  copy(issueNumber.value);
  toast.success({ message: 'Номер задачи скопирован!' });
};
</script>

<style scoped>
.issue-card:hover {
  border-color: v-bind(computedColor);
}
</style>
