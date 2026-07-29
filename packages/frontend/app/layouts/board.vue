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

import TheSidebar from '~/components/layouts/board/sidebar/TheSidebar.vue';
import TheHeader from '~/components/layouts/shared/header/TheHeader.vue';
import TheFooter from '~/components/layouts/shared/TheFooter.vue';

const boardsStore = useBoardsStore();

const { error } = await useAsyncData('fetch-boards', async () => {
  await boardsStore.fetchBoards();
  return null;
});

if (error.value) {
  throw createError(error.value);
}
</script>
