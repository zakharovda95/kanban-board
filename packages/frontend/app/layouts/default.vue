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

import TheFooter from '~/components/layouts/TheFooter.vue';
import TheHeader from '~/components/layouts/TheHeader.vue';
import TheSidebar from '~/components/layouts/TheSidebar.vue';

const boardsStore = useBoardsStore();

await useAsyncData('fetch-boards', async () => {
  console.log(123);
  await boardsStore.fetchBoards();
  return null;
});
</script>
