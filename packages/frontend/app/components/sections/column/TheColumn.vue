<template>
  <article
    class="border-light-300 bg-light-200 rounded-12 flex size-full w-280 shrink-0 flex-col items-center gap-8 overflow-hidden border"
  >
    <ColumnHeader :column="column" @update:board="emit('update:board')" />

    <div class="flex w-full items-center justify-between px-8">
      <div class="flex w-fit gap-4">
        <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800" :size="ESize.MEDIUM">
          {{ computedIssuesLength }}
        </UIBadge>
        <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800" :size="ESize.MEDIUM"> WIP ∞ </UIBadge>
      </div>
      <AddIssueButton :column-id="column.id" @update:board="emit('update:board')" />
    </div>

    <div v-if="column.issues.length" class="size-full overflow-hidden pb-8">
      <div class="flex h-[calc(100vh-368px)] w-full flex-col items-center gap-8 overflow-auto px-8">
        <IssueCard
          v-for="issue in column.issues"
          :key="issue.id"
          :issue="issue"
          :color="column.color"
          @update:board="emit('update:board')"
        />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { EColor, StringUtility, type TColumn } from '@kanban-board/common';

import { ESize } from '~/enums/global.enums';

import ColumnHeader from '~/components/sections/column/ColumnHeader.vue';
import AddIssueButton from '~/components/sections/issue/AddIssueButton.vue';
import IssueCard from '~/components/sections/issue/IssueCard.vue';
import UIBadge from '~/components/ui/UIBadge.vue';

const props = defineProps<{ column: TColumn }>();

const emit = defineEmits<{
  'update:board': [];
}>();

const computedIssuesLength = computed(() => {
  const length = props.column.issues.length;
  return length ? `${length} ${StringUtility.pluralize(length, ['задача', 'задачи', 'задач'])}` : 'Нет задач';
});
</script>
