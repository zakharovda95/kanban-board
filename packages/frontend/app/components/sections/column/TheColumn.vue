<template>
  <article class="border-light-300 rounded-12 flex size-full w-280 flex-col items-center gap-8 overflow-hidden border">
    <header
      class="bg-light-base flex h-60 w-full flex-col border-b-4 p-8 text-left"
      :style="{ borderBottomColor: column.color }"
    >
      <div class="flex w-full flex-row flex-nowrap items-center justify-between gap-4 overflow-hidden">
        <span class="text-14 font-medium text-ellipsis whitespace-nowrap">{{ column.title }}</span>
        <BaseActionsButtons />
      </div>
      <span class="text-elipsis text-12 w-full overflow-hidden font-light">
        {{ column.description }}
      </span>
    </header>

    <div class="flex w-full items-center justify-between px-8">
      <UIBadge class="bg-blue text-light-base">{{ computedIssuesLength }}</UIBadge>
      <UIIconButton class="bg-green! text-light-base!" icon="add-line" />
    </div>

    <div v-if="column.issues.length" class="flex w-full flex-col items-center gap-8 px-8">
      <IssueCard v-for="issue in column.issues" :key="issue.id" :issue="issue" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { StringUtility, type TColumn } from '@kanban-board/common';

import IssueCard from '~/components/sections/issue/IssueCard.vue';
import BaseActionsButtons from '~/components/shared/BaseActionsButtons.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIBadge from '~/components/ui/UIBadge.vue';

const props = defineProps<{ column: TColumn }>();

const computedIssuesLength = computed(() => {
  const length = props.column.issues.length;
  return length ? `${length} ${StringUtility.pluralize(length, ['задача', 'задачи', 'задач'])}` : 'Нет задач';
});
</script>
