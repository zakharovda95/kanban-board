<template>
  <article
    class="issue-card rounded-8 bg-light-base group flex h-fit w-full cursor-pointer flex-col gap-8 border border-transparent p-8 duration-300 select-none"
    :class="{ 'disabled-element hover:border-transparent!': isLoading }"
    @click="emit('open:details', issue)"
  >
    <header class="flex w-full items-start justify-between gap-8">
      <div class="flex flex-col gap-8">
        <div class="flex gap-4">
          <StopPreventWrapper>
            <UIBadge
              class="cursor-pointer"
              :background-color="color"
              :color="color ? ColorUtility.getTextColor(color, 170) : EColor.LIGHT_BASE"
              append-icon="mingcute:copy-line"
              size="small"
              @click:badge="copyIssueId"
            >
              {{ issueString }}
            </UIBadge>
          </StopPreventWrapper>

          <UIBadge v-if="false" :background-color="EColor.RED" size="small">Просрочена</UIBadge>
        </div>

        <IssueDate :created-at="issue.createdAt" :days-passed-since-creation="daysPassedSinceCreation" />
      </div>

      <UILoader v-if="isLoading" :size="EIconSizeSmall.MEDIUM" />
      <StopPreventWrapper v-else>
        <ActionsButtons :actions="actions" :button-background-color="EColor.LIGHT_BASE" />
      </StopPreventWrapper>
    </header>

    <div class="flex">
      <h4 class="text-14 cursor-text font-medium select-text">{{ issue.title }}</h4>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ColorUtility, EColor, type TIssueBase } from '@kanban-board/common';

import { useIssueInfo } from '~/composables/app/use-issue-info.composable';
import { ACTIONS_BUTTONS_DATA } from '~/constants/actions-buttons.constants.ts';
import { EIconSizeSmall } from '~/enums/global.enums';
import type { TActionButtonData } from '~/types/shared.types.ts';

import IssueDate from '~/components/sections/issue/IssueDate.vue';
import ActionsButtons from '~/components/shared/ActionsButtons.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';
import UIBadge from '~/components/ui/UIBadge.vue';
import UILoader from '~/components/ui/UILoader.vue';

const props = withDefaults(
  defineProps<{
    color?: string;
    issue: TIssueBase;
    isLoading?: boolean;
  }>(),
  {
    color: EColor.GREEN,
    isLoading: false,
  },
);

const emit = defineEmits<{
  'open:details': [payload: TIssueBase];
}>();

const { issue } = toRefs(props);

const computedColor = computed(() => props.color || EColor.GREEN);

const { issueString, daysPassedSinceCreation, copyIssueId, copyIssueTitle, copyIssueLink } = useIssueInfo(issue);

const actions = computed<TActionButtonData[]>(() => [
  {
    ...ACTIONS_BUTTONS_DATA.copy,
    handler: copyIssueTitle,
    disabled: false,
  },
  {
    ...ACTIONS_BUTTONS_DATA.share,
    handler: copyIssueLink,
    disabled: false,
  },
]);
</script>

<style scoped>
.issue-card:hover {
  border-color: v-bind(computedColor);
}
</style>
