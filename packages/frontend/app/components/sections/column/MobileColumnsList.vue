<template>
  <div class="bg-light-base rounded-12 flex size-full flex-col gap-8">
    <OverlayScrollbarsComponent v-if="boardStore.board?.columns.length" :options="scrollbarOptions">
      <div class="flex size-full flex-col gap-8">
        <div
          v-for="column in boardStore.board.columns"
          :key="column.id"
          class="rounded-8 border-light-200 flex min-h-42 shrink-0 items-center justify-between gap-8 border p-8"
          :class="{ 'border-green!': column.id === selectedColumnId }"
          @click="emit('select:column', column.id)"
        >
          <div class="flex size-10 shrink-0 rounded-full" :style="{ backgroundColor: column.color }" />
          <ColumnInfo :column="column" class="w-[calc(100%-60px)]" />
          <StopPreventWrapper>
            <ColumnActionsButtons :column-id="column.id" />
          </StopPreventWrapper>
        </div>
      </div>
    </OverlayScrollbarsComponent>
    <div v-else class="text-12">
      <p>Вы еще не добавили ни одной колонки.</p>
      <p>Добавьте колонку для начала работы.</p>
    </div>

    <AddColumnButton full />
  </div>
</template>

<script setup lang="ts">
import { OverlayScrollbarsComponent, type OverlayScrollbarsComponentProps } from 'overlayscrollbars-vue';

import { useBoardStore } from '~/stores/board.store.ts';

import AddColumnButton from '~/components/sections/column/AddColumnButton.vue';
import ColumnActionsButtons from '~/components/sections/column/ColumnActionsButtons.vue';
import ColumnInfo from '~/components/sections/column/ColumnInfo.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';

const boardStore = useBoardStore();

defineProps<{
  selectedColumnId: number | null;
}>();

const emit = defineEmits<{
  'select:column': [id: number];
}>();

const scrollbarOptions: OverlayScrollbarsComponentProps['options'] = {
  overflow: { x: 'hidden' },
  scrollbars: {
    autoHide: 'leave',
    autoHideDelay: 300,
    theme: 'os-theme-column',
  },
};
</script>
