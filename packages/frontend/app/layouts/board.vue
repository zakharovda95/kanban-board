<template>
  <div class="flex h-screen flex-col">
    <TheHeader />

    <main class="flex flex-1">
      <BoardSidebar />
      <slot />
    </main>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { useBoardsStore } from '~/stores/boards.store';

import BoardSidebar from '~/components/layouts/BoardSidebar/BoardSidebar.vue';
import TheFooter from '~/components/layouts/TheFooter.vue';
import TheHeader from '~/components/layouts/TheHeader.vue';

const boardsStore = useBoardsStore();

await useAsyncData('fetch-boards', async () => {
  await boardsStore.fetchBoards();
  return null;
});
</script>
