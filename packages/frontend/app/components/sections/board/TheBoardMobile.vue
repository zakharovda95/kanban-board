<template>
  <div class="flex size-full flex-col gap-12 p-12">
    <div class="bg-light-base rounded-12 flex h-56 w-full items-center justify-between gap-12 py-12 pr-12 pl-56">
      <button
        class="bg-light-100 rounded-6 m-auto flex h-32 w-[calc(100%-56px)] flex-row items-center justify-start gap-4 p-4 outline-none"
        @click="toggleColumnsMenu"
      >
        <template v-if="selectedColumn">
          <NuxtIcon
            name="mingcute:down-fill"
            :size="24"
            class="text-green shrink-0 rotate-0 duration-300"
            :class="{ 'rotate-180': isColumnsMenuOpen }"
          />

          <ColumnInfo :column="selectedColumn" class="w-[calc(100%-24px)]" hide-description />
        </template>
        <span v-else class="text-12 m-auto font-medium">Необходимо добавить колонку.</span>
      </button>
      <Transition name="fade">
        <div
          v-if="isColumnsMenuOpen"
          class="bg-light-100 absolute right-0 bottom-0 left-0 z-0 h-[calc(100vh-148px)] w-full overflow-hidden p-12"
        >
          <div class="bg-light-base rounded-12 size-full p-12">
            <div v-if="board?.columns.length" class="hide-scrollbar flex size-full flex-col gap-8 overflow-y-auto">
              <div
                v-for="column in board.columns"
                :key="column.id"
                class="rounded-8 border-light-200 flex min-h-42 items-center justify-between gap-8 border p-8"
                :class="{ 'border-green!': column.id === selectedColumn?.id }"
                @click="selectColumn(column.id)"
              >
                <div class="flex size-10 shrink-0 rounded-full" :style="{ backgroundColor: column.color }" />
                <ColumnInfo :column="column" class="w-[calc(100%-60px)]" />
                <StopPreventWrapper>
                  <ColumnActionsButtons :column-id="column.id" />
                </StopPreventWrapper>
              </div>
            </div>
            <div v-else class="flex size-full flex-1 items-center justify-center">
              <p class="text-14 text-center font-medium">Для начала работы необходимо добавить доску.</p>
            </div>
          </div>
        </div>
      </Transition>

      <AddColumnButton />
    </div>

    <div v-if="selectedColumn" class="flex flex-col items-center justify-start gap-12">
      <ColumnTopPanel :column="selectedColumn" />

      <div class="hide-scrollbar h-[calc(100vh-208px)] w-full overflow-y-auto">
        <div v-if="selectedColumn.issues.length" class="flex flex-col items-center justify-start gap-8">
          <IssueCard
            v-for="issue in selectedColumn.issues"
            :key="issue.id"
            :issue="issue"
            :is-loading="isLoadingIssueDetails && selectedIssueId === issue.id"
            :color="selectedColumn.color"
            @open:details="issueDetailsStore.openIssueDetails"
          />
        </div>
        <div v-else class="flex size-full items-center justify-center">
          <span class="text-14 font-medium">Нет задач</span>
        </div>

        <IssueDetailsModal
          v-if="issueDetails"
          :is-open="isModalOpen"
          :issue="issueDetails"
          :stages="stages"
          @update:is-open="issueDetailsStore.onModalClose"
          @update:issue="issueDetailsStore.onUpdateIssue"
          @delete:issue="issueDetailsStore.onDeleteIssue"
          @change:stage="issueDetailsStore.onChangeStage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useBoardStore } from '~/stores/board.store.ts';
import { useIssueDetailsStore } from '~/stores/issue-details.store.ts';

import AddColumnButton from '~/components/sections/column/AddColumnButton.vue';
import ColumnActionsButtons from '~/components/sections/column/ColumnActionsButtons.vue';
import ColumnInfo from '~/components/sections/column/ColumnInfo.vue';
import ColumnTopPanel from '~/components/sections/column/ColumnTopPanel.vue';
import IssueCard from '~/components/sections/issue/IssueCard.vue';
import IssueDetailsModal from '~/components/sections/issue/IssueDetailsModal.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';

const toast = useToast();

const boardStore = useBoardStore();
const issueDetailsStore = useIssueDetailsStore();

const { board } = storeToRefs(boardStore);

const { issueDetails, isLoadingIssueDetails, stages, issueIdFromQuery, selectedIssueId, isModalOpen } =
  storeToRefs(issueDetailsStore);

if (issueIdFromQuery.value) {
  issueDetailsStore.subscribeToIssueUpdates();
}

const isColumnsMenuOpen = ref(false);
const selectedColumnId = ref<number | null>(board.value?.columns[0]?.id ?? null);

const selectedColumn = computed(() => {
  if (!board.value?.columns.length) return null;
  return board.value.columns.find(({ id }) => id === selectedColumnId.value) ?? board.value.columns[0] ?? null;
});

const selectColumn = (columnId: number) => {
  if (!columnId || columnId <= 0) return;

  const exists = board.value?.columns.some(({ id }) => id === columnId);
  if (!exists) {
    toast.error({ message: 'Колонка не найдена' });
    return;
  }

  selectedColumnId.value = columnId;
  isColumnsMenuOpen.value = false;
};

const toggleColumnsMenu = () => {
  if (!selectedColumn.value) return;
  isColumnsMenuOpen.value = !isColumnsMenuOpen.value;
};

onBeforeUnmount(() => {
  issueDetailsStore.stopListen();
  issueDetailsStore.resetStore();
});
</script>
