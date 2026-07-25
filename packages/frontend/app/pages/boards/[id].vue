<template>
  <div class="flex size-full items-center justify-center">
    <TheBoard :board="data ?? null" :is-loading="pending" @update:columns="refresh" />
  </div>
</template>

<script setup lang="ts">
import type { TBoard } from '@kanban-board/common';

import TheBoard from '~/components/sections/board/TheBoard.vue';

definePageMeta({
  layout: 'board',
});

const route = useRoute();

const { data, pending, error, refresh } = await useFetch<TBoard>(`/api/boards/${route.params.id}`);

if (error.value) {
  navigateTo('/boards');
}
</script>
