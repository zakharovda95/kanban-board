<template>
  <div class="laptop:hidden block">
    <UIIconButton
      class="absolute top-104 left-24"
      icon="mingcute:grid-2-fill"
      :background-color="EColor.LIGHT_200"
      :color="EColor.LIGHT_800"
      @click:button="isBoardsMenuOpen = !isBoardsMenuOpen"
    />
    <Transition name="fade">
      <div
        v-if="isBoardsMenuOpen"
        class="bg-light-100 absolute right-0 bottom-0 left-0 z-1 h-[calc(100vh-148px)] w-full p-12"
      >
        <BoardsList @click:board="isBoardsMenuOpen = false" />
      </div>
    </Transition>
  </div>

  <aside class="laptop:flex hidden h-full w-280 shrink-0 flex-col items-center justify-between gap-12 py-12 pr-0 pl-12">
    <BoardsList />
    <div class="bg-light-base rounded-12 w-full p-12">
      <TheProfile />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import BoardsList from '~/components/sections/board/BoardsList.vue';
import TheProfile from '~/components/shared/TheProfile.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const isBoardsMenuOpen = ref(false);
</script>
