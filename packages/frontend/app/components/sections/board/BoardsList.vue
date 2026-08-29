<template>
  <div class="bg-light-base rounded-12 flex size-full h-full flex-col gap-12 p-12">
    <UILoader v-if="boardsStore.isLoadingBoards" full />
    <template v-else>
      <h4 class="font-medium">Мои доски</h4>
      <template v-if="boardsStore.boards?.length">
        <draggable
          v-model="boardsStore.boards"
          class="hide-scrollbar flex h-fit w-full flex-col gap-8 overflow-auto"
          item-key="order"
          group="border-list"
          tag="nav"
          ghost-class="drag-ghost"
          :disabled="boardsStore.boards.length <= 1"
          :animation="200"
          @start="boardsStore.takeSnapshot"
          @change="onBoardMove"
        >
          <template #item="{ element: board }">
            <div
              class="border-light-200 rounded-8 bg-light-base elect-none h-60 w-full flex-1 shrink-0 cursor-pointer border"
              :class="{ 'border-green!': board.id === boardId }"
            >
              <UILink
                :to="`/boards/${board.id}`"
                :hoverable="false"
                class="flex size-full items-center justify-between gap-8 p-8 duration-300"
                @click="onClickBoard(board.id)"
              >
                <div class="w-[calc(100%-32px)] text-left">
                  <p class="text-14 block overflow-hidden leading-18 font-medium text-ellipsis whitespace-nowrap">
                    {{ board.title }} {{ board.id }}
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
            </div>
          </template>
        </draggable>
      </template>
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
import {
  BOARDS_MAX_COUNT,
  EBoardEvent,
  getErrorMessage,
  type TBoardBase,
  type TMoveBoardResponse,
  type TMoveParameters,
} from '@kanban-board/common';

import { useSocket } from '~/composables/use-socket.composable.ts';
import { useBoardsStore } from '~/stores/boards.store.ts';
import type { TMovedDetails } from '~/types/shared.types.ts';

import AddBoardButton from '~/components/sections/board/AddBoardButton.vue';
import BoardActionsButtons from '~/components/sections/board/BoardActionsButtons.vue';
import UILink from '~/components/ui/UILink.vue';
import UILoader from '~/components/ui/UILoader.vue';

const emit = defineEmits<{
  'click:board': [];
}>();

const route = useRoute();
const boardsStore = useBoardsStore();
const toast = useToast();
const { emitEvent } = useSocket();

const boardId = computed(() => Number(route.params.id));
const isTooMuchBoards = computed(() => boardsStore.boards.length >= BOARDS_MAX_COUNT);

const onClickBoard = (id: number) => {
  if (id === boardId.value) return;
  emit('click:board');
};

const onBoardMove = (details: TMovedDetails<TBoardBase>) => {
  const targetId = details.moved.element.id;
  const targetNewIndex = details.moved.newIndex;
  const previousId = boardsStore.boards[targetNewIndex - 1]?.id ?? null;

  emitEvent<TMoveParameters, TMoveBoardResponse>({
    event: EBoardEvent.MOVE,
    data: { previousId, targetId },
    successCallback: (response: TMoveBoardResponse) => {
      if (response.isSuccess && response.data) {
        boardsStore.boards = [...response.data.boards];
        toast.success({ message: `Доска перемещена` });
        boardsStore.deleteSnapshot();
      }
    },
    errorCallback: (error: unknown) => {
      toast.error({ message: getErrorMessage(error) });
      boardsStore.deleteSnapshot();
    },
  });
};
</script>
