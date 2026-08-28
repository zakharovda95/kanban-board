<template>
  <div class="flex size-full flex-col items-center justify-center gap-24">
    <span class="text-16 font-medium">Страница в разработке</span>

    <draggable :model-value="items" v-bind="dragOptions" @move="logChange" @update:model-value="updateItems">
      <template #item="{ element: item }">
        <div class="rounded-6 bg-light-base h-60 cursor-move p-12" :data-order="`order-${item.order}`">
          {{ item.message }}
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import { sleep } from '@kanban-board/common';

const dragOptions = ref({
  class: 'flex flex-col gap-12',
  animation: 200,
  itemKey: 'order',
  group: 'test',
  disabled: false,
  ghostClass: 'border border-green',
  tag: 'ul',
  componentData: {
    tag: 'li',
  },
});

type TItem = { order: number; message: string };

const items = ref<TItem[]>([
  { order: 1, message: 'Test One' },
  { order: 2, message: 'Test Two' },
  { order: 3, message: 'Test Three' },
  { order: 4, message: 'Test Four' },
  { order: 5, message: 'Test Five' },
]);

const movedItem = ref<object | null>(null);
const logChange = (ev: object, data: object) => {
  console.log('movedItem', ev, data);
  movedItem.value = ev;
};

const updateItems = async (updatedItems: TItem[]) => {
  console.log('updateItem');
  await sleep(1000);
  items.value = [...updatedItems];
};
</script>
