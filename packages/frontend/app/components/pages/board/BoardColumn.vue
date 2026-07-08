<template>
  <article
    class="border-light-300 rounded-8 flex size-full max-w-280 flex-col items-center gap-8 overflow-hidden border"
  >
    <header
      class="bg-light-200 flex h-60 w-full flex-col border-b-4 p-8 text-left"
      :style="{ borderBottomColor: column.color }"
    >
      <div class="flex w-full flex-row flex-nowrap items-center justify-between gap-4 overflow-hidden">
        <span class="text-14 font-medium text-ellipsis whitespace-nowrap">{{ column.title }}</span>
        <div class="justify-right flex w-fit gap-4">
          <UIIconButton icon="pencil-line" />
          <UIIconButton icon="delete-2-line" />
        </div>
      </div>
      <span class="text-elipsis text-12 text-light-800 w-full overflow-hidden font-light">
        {{ column.description }}
      </span>
    </header>

    <div class="flex w-full items-center justify-between px-8">
      <UIBadge>{{ computedIssuesLength }}</UIBadge>
      <UIIconButton icon="add-line" />
    </div>

    <div v-if="column.issues.length" class="flex flex-col items-center gap-8 px-8">
      <BoardIssueCard v-for="issue in column.issues" :key="issue.id" :issue="issue" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { StringUtility, type TColumn } from '@kanban-board/common';

import BoardIssueCard from '~/components/pages/board/BoardIssueCard.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIBadge from '~/components/ui/UIBadge.vue';

const props = defineProps<{ column: TColumn }>();

const computedIssuesLength = computed(() => {
  const length = props.column.issues.length;
  return length ? `${length} ${StringUtility.pluralize(length, ['задача', 'задачи', 'задач'])}` : 'Нет задач';
});
</script>
