<template>
  <aside
    class="laptop:h-full laptop:w-280 laptop:justify-between laptop:py-12 laptop:pr-0 laptop:pl-12 flex h-fit w-full shrink-0 flex-col items-center justify-center gap-12 p-12"
  >
    <div class="bg-light-base rounded-8 laptop:hidden block w-full p-12">
      <UIIconButton
        icon="grid-2-fill"
        :size="ESize.LARGE"
        :background-color="EColor.LIGHT_200"
        :color="EColor.LIGHT_700"
        @click:button="isBoardsMenuOpen = !isBoardsMenuOpen"
      />
      <Transition name="fade">
        <div v-if="isBoardsMenuOpen" class="absolute right-0 bottom-0 left-0 z-1 h-[calc(100vh-156px)] w-full p-12">
          <BoardsList @click:board="isBoardsMenuOpen = false" />
        </div>
      </Transition>
    </div>

    <BoardsList class="laptop:flex hidden" />

    <div class="laptop:block bg-light-base rounded-12 hidden w-full p-12">
      <TheProfile />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { ESize } from '~/enums/global.enums.ts';

import BoardsList from '~/components/sections/board/BoardsList.vue';
import TheProfile from '~/components/shared/TheProfile.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const isBoardsMenuOpen = ref(false);
</script>
