<template>
  <div class="flex h-screen flex-col">
    <TheHeader />

    <main class="laptop:flex-row flex flex-1 flex-col">
      <TheSidebar />
      <slot />
    </main>

    <TheFooter class="laptop:flex hidden" />

    <UIConfirmationModal
      v-model:is-open="isOpenReloadPageModal"
      title="Соединение потеряно!"
      text="Необходимо перезагрузить страницу."
      action-button-label="Перезагрузить"
      hide-reset-button
      @click:confirm="reloadPage"
    />
  </div>
</template>

<script setup lang="ts">
import { useAfkWatcher } from '~/composables/use-afk-watcher.composable';
import { useSocket } from '~/composables/use-socket.composable';
import { useBoardsStore } from '~/stores/boards.store';

import TheSidebar from '~/components/layouts/board/TheSidebar.vue';
import TheHeader from '~/components/layouts/shared/header/TheHeader.vue';
import TheFooter from '~/components/layouts/shared/TheFooter.vue';
import UIConfirmationModal from '~/components/ui/modals/UIConfirmationModal.vue';

const boardsStore = useBoardsStore();
const { listen, $socket } = useSocket();

const { error } = await useAsyncData('fetch-boards', async () => {
  await boardsStore.fetchBoards(undefined, true);
  return null;
});

if (error.value) {
  throw createError(error.value);
}

const isOpenReloadPageModal = ref(false);

const openReloadPageModal = () => {
  if (isOpenReloadPageModal.value) return;
  isOpenReloadPageModal.value = true;
  $socket?.disconnect();
};

const reloadPage = () => {
  if (!window.location) return;
  window.location.reload();
};

useAfkWatcher(openReloadPageModal);

const stopListenDisconnect = listen('disconnect', openReloadPageModal);

onBeforeUnmount(() => {
  stopListenDisconnect();
  boardsStore.stopListen();
  boardsStore.resetStore();
});
</script>
