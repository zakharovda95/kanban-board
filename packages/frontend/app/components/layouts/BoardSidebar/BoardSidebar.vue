<template>
  <aside class="flex size-full max-w-280 items-center justify-center py-12 pr-0 pl-12">
    <div class="bg-light-base rounded-12 size-full p-12">
      <UILoader v-if="boardsStore.isLoadingBoards" full />
      <nav v-else-if="!boardsStore.isLoadingBoards && boardsStore.boards.length" class="flex w-full flex-col gap-8">
        <UILink
          v-for="board in boardsStore.boards"
          :key="board.id"
          :to="`/boards/${board.id}`"
          :hoverable="false"
          class="border-light-200 justify-right rounded-8 flex h-60 w-full flex-1 cursor-pointer items-center justify-between gap-4 border p-8 duration-300"
          :class="{ 'border-green!': isActiveBoard(board.id) }"
        >
          <StopPreventWrapper>
            <DragArea />
          </StopPreventWrapper>

          <div class="flex w-[calc(100%-(16px+8px+24px))] flex-col gap-4 text-left">
            <span class="text-14 block overflow-hidden font-medium text-ellipsis whitespace-nowrap">
              {{ board.title }}
            </span>
            <span class="text-12 block overflow-hidden font-light text-ellipsis whitespace-nowrap">
              {{ board.description }}
            </span>
          </div>

          <StopPreventWrapper>
            <BaseActionsButtons />
          </StopPreventWrapper>
        </UILink>
      </nav>
      <div v-else class="p-8">
        <p class="text-12">{{ NO_BOARDS_TEXT }}</p>
      </div>

      <UIButton
        class="bg-green! text-light-base! mt-12"
        prepend-icon="add-line"
        full
        :size="ESize.MEDIUM"
        @click:button="isCreateModalOpen = true"
      >
        {{ boardsStore.boards.length ? 'Добавить доску' : 'Создать доску' }}
      </UIButton>
      <BoardSidebarCreateBoardModal v-model:is-open="isCreateModalOpen" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { NO_BOARDS_TEXT } from '~/constants/board.constants';
import { ESize } from '~/enums/global.enums';
import { useBoardsStore } from '~/stores/boards.store';

import BoardSidebarCreateBoardModal from '~/components/layouts/BoardSidebar/BoardSidebarCreateBoardModal.vue';
import BaseActionsButtons from '~/components/shared/BaseActionsButtons.vue';
import DragArea from '~/components/shared/DragArea.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UILink from '~/components/ui/links/UILink.vue';

const route = useRoute();
const boardsStore = useBoardsStore();

const isCreateModalOpen = ref(false);

const isActiveBoard = (boardId: number) => Number(route.params.id) === boardId;
</script>
