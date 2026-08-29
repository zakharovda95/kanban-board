<template>
  <div class="size-full">
    <UILoader v-if="isLoading" :size="32" full />
    <div v-else-if="!isLoading && !board && errorText" class="flex size-full items-center justify-center p-12">
      <p class="text-14 font-medium">{{ errorText }}</p>
    </div>
    <div class="flex size-full flex-col gap-12 p-12">
      <div class="bg-light-base rounded-12 flex h-56 w-full items-center justify-between gap-12 py-12 pr-12 pl-56">
        <button
          v-if="selectedColumn"
          class="bg-light-200 rounded-6 m-auto flex h-32 w-[calc(100%-56px)] flex-row items-center justify-start gap-4 p-4 outline-none"
          @click="isColumnsMenuOpen = !isColumnsMenuOpen"
        >
          <NuxtIcon
            name="mingcute:down-fill"
            :size="24"
            class="text-green shrink-0 rotate-0 duration-300"
            :class="{ 'rotate-180': isColumnsMenuOpen }"
          />

          <ColumnInfo :column="selectedColumn" class="w-[calc(100%-24px)]" />
        </button>
        <Transition name="fade">
          <div
            v-if="isColumnsMenuOpen"
            class="bg-light-100 absolute right-0 bottom-0 left-0 z-0 h-[calc(100vh-148px)] w-full overflow-hidden p-12"
          >
            <div class="bg-light-base rounded-12 size-full p-12">
              <div class="hide-scrollbar flex size-full flex-col gap-8 overflow-y-auto">
                <div
                  v-for="column in board?.columns ?? []"
                  :key="column.id"
                  class="rounded-8 border-light-200 flex min-h-42 items-center justify-between gap-8 border p-8"
                  :class="{ 'border-green!': column.id === selectedColumn?.id }"
                  @click="selectColumn(column.id)"
                >
                  <div class="flex size-10 shrink-0 rounded-full" :style="{ backgroundColor: column.color }" />
                  <ColumnInfo :column="column" class="w-[calc(100%-60px)]" />
                  <StopPreventWrapper>
                    <ColumnActionsButtons
                      :column="column"
                      @update:column="emit('update:column', $event)"
                      @delete:column="emit('delete:column', $event)"
                    />
                  </StopPreventWrapper>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <AddColumnButton />
      </div>

      <div v-if="selectedColumn" class="flex flex-col items-center justify-start gap-12">
        <ColumnTopPanel :column="selectedColumn" @add:issue="emit('add:issue', $event)" />

        <div class="hide-scrollbar h-[calc(100vh-208px)] w-full overflow-y-auto">
          <div v-if="selectedColumn.issues.length" class="flex flex-col items-center justify-start gap-8">
            <IssueCard
              v-for="issue in selectedColumn.issues"
              :key="issue.id"
              :issue="issue"
              :color="selectedColumn.color"
              @update:issue="emit('update:issue', $event)"
              @delete:issue="emit('delete:issue', $event)"
            />
          </div>
          <div v-else class="flex size-full items-center justify-center">
            <span class="text-14 font-medium">Нет задач</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  TBoard,
  TColumn,
  TDeleteColumnEmitPayload,
  TDeleteIssueEmitPayload,
  TIssueBase,
} from '@kanban-board/common';

import AddColumnButton from '~/components/sections/column/AddColumnButton.vue';
import ColumnActionsButtons from '~/components/sections/column/ColumnActionsButtons.vue';
import ColumnInfo from '~/components/sections/column/ColumnInfo.vue';
import ColumnTopPanel from '~/components/sections/column/ColumnTopPanel.vue';
import IssueCard from '~/components/sections/issue/IssueCard.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';
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

const isColumnsMenuOpen = ref(false);
const selectedColumn = ref<TColumn | null>(props.board?.columns?.[0] ?? null);

const selectColumn = (columnId: number) => {
  if (!props.board || columnId <= 0) return;

  const newColumn = props.board?.columns.find(({ id }) => id === columnId);
  if (!newColumn) {
    toast.error({ message: 'Колонка не найдена' });
    return;
  }

  selectedColumn.value = newColumn;
  isColumnsMenuOpen.value = false;
};

// TODO: Обновление selectedColumn при изменении доски. Подумать над более оптимизированным решением.
watch(
  () => props.board,
  () => {
    selectColumn(selectedColumn.value?.id ?? 0);
  },
  { deep: true, immediate: false },
);
</script>
