<template>
  <div class="flex h-screen flex-col">
    <TheHeader />

    <main class="flex flex-1">
      <TheSidebar />
      <slot />
    </main>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { useBoardsStore } from '~/stores/boards.store';

import TheSidebar from '~/components/layouts/board/TheSidebar.vue';
import TheFooter from '~/components/layouts/shared/TheFooter.vue';
import TheHeader from '~/components/layouts/shared/TheHeader.vue';

const boardsStore = useBoardsStore();

await useAsyncData('fetch-boards', async () => {
  await boardsStore.fetchBoards();
  return null;
});
</script>
