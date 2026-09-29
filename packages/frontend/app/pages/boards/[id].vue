<template>
  <div class="flex size-full items-center justify-center">
    <div v-if="errorMessage" class="flex size-full items-center justify-center p-12">
      <p class="text-14 font-medium">{{ errorMessage }}</p>
    </div>
    <TheBoard v-else />
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from '~/stores/board.store.ts';

import TheBoard from '~/components/sections/board/TheBoard.vue';
definePageMeta({
  layout: 'board',
});

const boardStore = useBoardStore();

const route = useRoute();
const toast = useToast();

const errorMessage = ref<string | null>(null);
const boardId = computed(() => Number(route.params.id));

const { error } = await useAsyncData(`fetch-board-${boardId.value}`, async () => {
  await boardStore.fetchBoard(boardId.value, false);
  return null;
});

if (error.value) {
  const message = 'Произошла ошибка при загрузке доски.';
  errorMessage.value = message;
  toast.error({ message });
}

onMounted(() => {
  boardStore.joinBoard(boardId.value);
});

onBeforeUnmount(() => {
  boardStore.leaveBoard(boardId.value);
});
</script>
