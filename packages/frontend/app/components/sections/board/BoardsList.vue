<template>
  <div class="bg-light-base rounded-12 flex size-full h-full flex-col gap-12 p-12">
    <UILoader v-if="boardsStore.isLoadingBoards" full />
    <template v-else>
      <h4 class="font-medium">Мои доски</h4>
      <draggable
        v-if="!boardsStore.isLoadingBoards && boardsStore.boards?.length"
        :model-value="boardsStore.boards"
        class="hide-scrollbar flex h-fit w-full flex-col gap-8 overflow-auto"
        item-key="order"
        group="border-list"
        tag="nav"
        ghost-class="drag-ghost"
        :disabled="boardsStore.boards.length <= 1"
        :animation="200"
        @update:model-value="moveBoards"
        @move="onMove"
        @change="onChanged"
      >
        <template #item="{ element: board }">
          <UILink
            :to="`/boards/${board.id}`"
            :hoverable="false"
            class="border-light-200 rounded-8 bg-light-base flex h-60 w-full flex-1 shrink-0 cursor-pointer items-center justify-between gap-8 border p-8 duration-300 select-none"
            :class="{ 'border-green!': board.id === boardId }"
            @click="onClickBoard(board.id)"
          >
            <div class="w-[calc(100%-32px)] text-left">
              <p class="text-14 block overflow-hidden leading-18 font-medium text-ellipsis whitespace-nowrap">
                {{ board.title }}
              </p>
              <p class="text-12 block overflow-hidden leading-16 font-light text-ellipsis whitespace-nowrap">
                {{ board.description }}
              </p>
            </div>

            <BoardActionsButtons
              :board="board"
              @update:board="boardsStore.updateBoard"
              @delete:board="boardsStore.deleteBoard"
            />
          </UILink>
        </template>
      </draggable>
      <div v-else class="text-12 p-8">
        <p>Вы еще не добавили ни одной доски.</p>
        <p>Добавьте новую доску для начала работы.</p>
      </div>

      <AddBoardButton
        :disabled="isTooMuchBoards"
        :show-tooltip="isTooMuchBoards"
        @add:board="boardsStore.addNewBoard"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import { BOARDS_MAX_COUNT, type TBoardBase } from '@kanban-board/common';

import { useBoardsStore } from '~/stores/boards.store.ts';

import AddBoardButton from '~/components/sections/board/AddBoardButton.vue';
import BoardActionsButtons from '~/components/sections/board/BoardActionsButtons.vue';
import UILink from '~/components/ui/UILink.vue';
import UILoader from '~/components/ui/UILoader.vue';

const emit = defineEmits<{
  'click:board': [];
}>();

const route = useRoute();
const boardsStore = useBoardsStore();

const boardId = computed(() => Number(route.params.id));
const isTooMuchBoards = computed(() => boardsStore.boards.length >= BOARDS_MAX_COUNT);

const onClickBoard = (id: number) => {
  if (id === boardId.value) return;
  emit('click:board');
};

const onMove = (event: object) => {
  console.log('onMove', event);
};

const onChanged = async (updatedItems: object) => {
  console.log('onChanged', updatedItems);
};

const moveBoards = (boards: TBoardBase[]) => {
  console.log('update:modelValue', boards);
  boardsStore.boards = [...boards];
};
</script>
