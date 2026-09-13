<template>
  <div class="flex size-full items-center justify-center">
    <UILoader v-if="showLoader" :size="64" full />
    <div v-else-if="errorMessage" class="flex size-full items-center justify-center p-12">
      <p class="text-14 font-medium">{{ errorMessage }}</p>
    </div>
    <template v-else-if="boardStore.board">
      <TheBoard v-if="isLaptop" />
      <TheBoardMobile v-else />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useIsLaptop } from '~/composables/use-is-laptop.composable.ts';
import { useBoardStore } from '~/stores/board.store.ts';

import TheBoard from '~/components/sections/board/TheBoard.vue';
import TheBoardMobile from '~/components/sections/board/TheBoardMobile.vue';
import UILoader from '~/components/ui/UILoader.vue';

definePageMeta({
  layout: 'board',
});

const boardStore = useBoardStore();

const isMounted = useMounted();
const route = useRoute();
const toast = useToast();
const isLaptop = useIsLaptop();

const errorMessage = ref<string | null>(null);
const boardId = computed(() => Number(route.params.id));

const { error } = await useAsyncData(`fetch-board-${boardId.value}`, async () => {
  await boardStore.fetchBoard(boardId.value);
  return null;
});

if (error.value) {
  const message = 'Произошла ошибка при загрузке доски.';
  errorMessage.value = message;
  toast.error({ message });
}

const showLoader = computed(() => !isMounted.value || boardStore.isLoadingBoard);

onMounted(() => {
  boardStore.joinBoard(boardId.value);
});

onBeforeUnmount(() => {
  boardStore.leaveBoard(boardId.value);
});
</script>
