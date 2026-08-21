<template>
  <div class="size-full">
    <UILoader v-if="isLoading" :size="32" full />
    <div v-else-if="!isLoading && !board && errorText" class="flex size-full items-center justify-center p-12">
      <p class="text-14 font-medium">{{ errorText }}</p>
    </div>
    <div class="flex size-full flex-col gap-12 p-12">
      <div class="bg-light-base rounded-12 flex h-56 items-center justify-between gap-12 p-12">
        <UIIconButton
          icon="grid-2-fill"
          :size="ESize.MEDIUM"
          :background-color="EColor.LIGHT_200"
          :color="EColor.LIGHT_700"
          @click:button="isBoardsMenuOpen = !isBoardsMenuOpen"
        />
        <Transition name="fade">
          <div
            v-if="isBoardsMenuOpen"
            class="bg-light-200 absolute right-0 bottom-0 left-0 z-1 h-[calc(100vh-148px)] w-full p-12"
          >
            <BoardsList @click:board="isBoardsMenuOpen = false" />
          </div>
        </Transition>

        <!-- TODO: ломается при большом описании или заголовке, поработать с шириной -->
        <button
          v-if="selectedColumn"
          class="m-0 flex flex-row items-center justify-center gap-4 bg-none p-0 outline-none"
          @click="isColumnsMenuOpen = !isColumnsMenuOpen"
        >
          <NuxtIcon
            name="mingcute:down-fill"
            :size="22"
            class="text-green rotate-0 duration-300"
            :class="{ 'rotate-180': isColumnsMenuOpen }"
          />
          <ColumnInfo
            :column="selectedColumn"
            @update:column="emit('update:column', $event)"
            @delete:column="emit('delete:column', $event)"
          />
        </button>
        <Transition name="fade">
          <div
            v-if="isColumnsMenuOpen"
            class="bg-light-200 absolute right-0 bottom-0 left-0 z-0 h-[calc(100vh-148px)] w-full overflow-hidden p-12"
          >
            <!-- TODO: при скролле нет падинга, скроллится прямо в бордер - не красиво -->
            <div class="bg-light-base rounded-12 flex size-full flex-col gap-8 overflow-y-auto p-12">
              <div
                v-for="column in board?.columns ?? []"
                :key="column.id"
                class="rounded-8 border-light-200 flex min-h-42 shrink-0 items-center gap-8 border p-8"
                :class="{ 'border-green!': column.id === selectedColumn?.id }"
                @click="selectColumn(column.id)"
              >
                <div class="size-10 rounded-full" :style="{ backgroundColor: column.color }" />
                <ColumnInfo :column="column" without-actions />
              </div>
            </div>
          </div>
        </Transition>

        <AddColumnButton />
      </div>

      <div v-if="selectedColumn" class="flex flex-col items-center justify-start gap-12">
        <ColumnTopPanel :column="selectedColumn" @add:issue="emit('add:issue', $event)" />

        <div class="h-[calc(100vh-208px)] w-full overflow-y-auto">
          <div class="flex flex-col items-center justify-start gap-8">
            <IssueCard
              v-for="issue in selectedColumn.issues"
              :key="issue.id"
              :issue="issue"
              :color="selectedColumn.color"
              @update:issue="emit('update:issue', $event)"
              @delete:issue="emit('delete:issue', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EColor,
  type TBoard,
  type TColumn,
  type TDeleteColumnEmitPayload,
  type TDeleteIssueEmitPayload,
  type TIssueBase,
} from '@kanban-board/common';

import { ESize } from '~/enums/global.enums.ts';

import BoardsList from '~/components/sections/board/BoardsList.vue';
import AddColumnButton from '~/components/sections/column/AddColumnButton.vue';
import ColumnInfo from '~/components/sections/column/ColumnInfo.vue';
import ColumnTopPanel from '~/components/sections/column/ColumnTopPanel.vue';
import IssueCard from '~/components/sections/issue/IssueCard.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UILoader from '~/components/ui/UILoader.vue';

const props = withDefaults(
  defineProps<{
    board: TBoard | null;
    errorText?: string | null;
    isLoading?: boolean;
  }>(),
  {
    errorText: null,
    isLoading: false,
  },
);

const emit = defineEmits<{
  'add:column': [payload: TColumn];
  'update:column': [payload: TColumn];
  'delete:column': [payload: TDeleteColumnEmitPayload];
  'add:issue': [payload: TIssueBase];
  'update:issue': [payload: TIssueBase];
  'delete:issue': [payload: TDeleteIssueEmitPayload];
}>();

const toast = useToast();

const isBoardsMenuOpen = ref(false);
const isColumnsMenuOpen = ref(false);
const selectedColumn = ref<TColumn | null>(props.board?.columns?.[0] ?? null);

// TODO: поработать с выбранной колонкой при удалении и редактировании через вебсокет (не редактируется и не удаляется)
const selectColumn = (columnId: number) => {
  if (!props.board) return;

  const newColumn = props.board?.columns.find(({ id }) => id === columnId);
  if (!newColumn) {
    toast.error({ message: 'Колонка не найдена' });
    return;
  }

  selectedColumn.value = newColumn;
  isColumnsMenuOpen.value = false;
};
</script>
