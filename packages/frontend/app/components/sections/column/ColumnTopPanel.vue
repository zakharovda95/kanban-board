<template>
  <div class="laptop:px-8 flex w-full items-center justify-between px-0">
    <div class="flex w-fit gap-4">
      <UIBadge :background-color="EColor.LIGHT_200" :color="EColor.LIGHT_800">
        {{ computedIssuesLength }}
      </UIBadge>
      <UIBadge :background-color="EColor.LIGHT_200" :color="EColor.LIGHT_800"> WIP ∞ </UIBadge>
    </div>

    <AddIssueButton :column-id="column.id" @add:issue="emit('add:issue', $event)" />
  </div>
</template>

<script setup lang="ts">
import { EColor, StringUtility, type TColumn, type TIssueBase } from '@kanban-board/common';

import AddIssueButton from '~/components/sections/issue/AddIssueButton.vue';
import UIBadge from '~/components/ui/UIBadge.vue';

const props = defineProps<{
  column: TColumn;
}>();

const emit = defineEmits<{
  'add:issue': [payload: TIssueBase];
}>();

const computedIssuesLength = computed(() => {
  const length = props.column.issues.length;
  return length ? `${length} ${StringUtility.pluralize(length, ['задача', 'задачи', 'задач'])}` : 'Нет задач';
});
</script>
