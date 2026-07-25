<template>
  <article class="border-light-300 rounded-12 flex size-full w-280 flex-col items-center gap-8 overflow-hidden border">
    <ColumnHeader :column="column" @update:columns="emit('update:columns')" />

    <div class="flex w-full items-center justify-between px-8">
      <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800">{{ computedIssuesLength }}</UIBadge>
      <UIIconButton icon="add-line" />
    </div>

    <div v-if="column.issues.length" class="flex w-full flex-col items-center gap-8 px-8">
      <IssueCard v-for="issue in column.issues" :key="issue.id" :issue="issue" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { EColor, StringUtility, type TColumn } from '@kanban-board/common';

import ColumnHeader from '~/components/sections/column/ColumnHeader.vue';
import IssueCard from '~/components/sections/issue/IssueCard.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIBadge from '~/components/ui/UIBadge.vue';

const props = defineProps<{ column: TColumn }>();

const emit = defineEmits<{
  'update:columns': [];
}>();

const computedIssuesLength = computed(() => {
  const length = props.column.issues.length;
  return length ? `${length} ${StringUtility.pluralize(length, ['задача', 'задачи', 'задач'])}` : 'Нет задач';
});
</script>
