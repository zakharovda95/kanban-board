<template>
  <aside class="flex size-full max-w-320 items-center justify-center p-12">
    <div class="bg-light-base rounded-12 size-full p-12">
      <UILoader v-if="boardsStore.isLoadingBoards" full />
      <nav v-else-if="!boardsStore.isLoadingBoards && boardsStore.boards.length" class="w-full">
        <UILink
          v-for="board in boardsStore.boards"
          :key="board.id"
          :to="`/boards/${board.id}`"
          :hoverable="false"
          class="border-b-light-300 justify-right flex h-60 w-full cursor-pointer items-center border-r-4 border-b border-r-transparent py-0 pr-4 pl-0 duration-300"
          :class="{ 'border-r-green!': isActiveBoard(board.id) }"
        >
          <StopPreventWrapper class="h-full">
            <DragArea />
          </StopPreventWrapper>

          <div class="flex w-[calc(100%-15px-4px-4px-24px)] flex-col gap-4 text-left">
            <span class="text-14 block overflow-hidden font-medium text-ellipsis whitespace-nowrap">
              {{ board.title }}
            </span>
            <span class="text-12 text-light-800 block overflow-hidden font-light text-ellipsis whitespace-nowrap">
              {{ board.description }}
            </span>
          </div>

          <StopPreventWrapper>
            <UIButtonWithContextMenu class="bg-light-300 text-light-800">
              <div class="flex flex-row flex-nowrap items-center justify-center gap-4">
                <UIIconButton class="bg-orange text-light-base" icon="pencil-line" />
                <UIIconButton class="bg-red text-light-base" icon="delete-2-line" />
              </div>
            </UIButtonWithContextMenu>
          </StopPreventWrapper>
        </UILink>
      </nav>
      <div v-else class="p-8 text-center">
        <span class="text-12 text-light-800">Вы еще не создали не одной доски.</span>
      </div>

      <div class="p-8">
        <UIButton class="bg-green text-light-base" prepend-icon="add-line" full :size="ESize.LARGE">
          Добавить доску
        </UIButton>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ESize } from '~/enums/global.enums';
import { useBoardsStore } from '~/stores/boards.store';

import DragArea from '~/components/shared/DragArea.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIButtonWithContextMenu from '~/components/ui/buttons/UIButtonWithContextMenu.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UILink from '~/components/ui/links/UILink.vue';

const route = useRoute();
const boardsStore = useBoardsStore();

const isActiveBoard = (boardId: number) => Number(route.params.id) === boardId;
</script>
