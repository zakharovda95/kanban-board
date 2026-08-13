<template>
  <article
    class="border-light-300 bg-light-200 rounded-12 flex size-full w-280 shrink-0 flex-col items-center gap-8 overflow-hidden border"
  >
    <header
      class="bg-light-base flex h-52 w-full flex-col border-b-4 px-12 py-8 text-left select-none"
      :style="{ borderBottomColor: column.color }"
    >
      <div class="flex size-full flex-nowrap items-center justify-between gap-8">
        <div class="flex flex-1 justify-between gap-8">
          <div class="h-full flex-1 overflow-hidden">
            <p class="text-14 font-medium text-ellipsis whitespace-nowrap">{{ column.title }}</p>
            <p class="text-elipsis text-12 w-full overflow-hidden font-light">
              {{ column.description }}
            </p>
          </div>

          <ColumnActionsButtons
            :column="column"
            @update:column="emit('update:column', $event)"
            @delete:column="emit('delete:column', $event)"
          />
        </div>
      </div>
    </header>

    <div class="flex w-full items-center justify-between px-8">
      <div class="flex w-fit gap-4">
        <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800" :size="ESize.MEDIUM">
          {{ computedIssuesLength }}
        </UIBadge>
        <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800" :size="ESize.MEDIUM"> WIP ∞ </UIBadge>
      </div>

      <AddIssueButton :column-id="column.id" @add:issue="emit('add:issue', $event)" />
    </div>

    <div v-if="column.issues.length" class="size-full overflow-hidden">
      <div class="flex h-[calc(100vh-368px)] w-full flex-col items-center gap-8 overflow-auto px-8">
        <IssueCard
          v-for="issue in column.issues"
          :key="issue.id"
          :issue="issue"
          :color="column.color"
          @update:issue="emit('update:issue', $event)"
          @delete:issue="emit('delete:issue', $event)"
        />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import {
  EColor,
  StringUtility,
  type TColumn,
  type TDeleteColumnEmitPayload,
  type TDeleteIssueEmitPayload,
  type TIssueBase,
} from '@kanban-board/common';

import { ESize } from '~/enums/global.enums';

import ColumnActionsButtons from '~/components/sections/column/ColumnActionsButtons.vue';
import AddIssueButton from '~/components/sections/issue/AddIssueButton.vue';
import IssueCard from '~/components/sections/issue/IssueCard.vue';
import UIBadge from '~/components/ui/UIBadge.vue';

const props = defineProps<{ column: TColumn }>();

const emit = defineEmits<{
  'update:column': [payload: TColumn];
  'delete:column': [payload: TDeleteColumnEmitPayload];
  'add:issue': [payload: TIssueBase];
  'update:issue': [payload: TIssueBase];
  'delete:issue': [payload: TDeleteIssueEmitPayload];
}>();

const computedIssuesLength = computed(() => {
  const length = props.column.issues.length;
  return length ? `${length} ${StringUtility.pluralize(length, ['задача', 'задачи', 'задач'])}` : 'Нет задач';
});
</script>
