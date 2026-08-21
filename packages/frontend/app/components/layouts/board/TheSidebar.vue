<template>
  <aside class="flex h-full w-280 shrink-0 flex-col items-center justify-between gap-12 py-12 pr-0 pl-12">
    <BoardsList />
    <div class="bg-light-base rounded-12 w-full p-12">
      <TheProfile />
    </div>
  </aside>
</template>

<script setup lang="ts">
import BoardsList from '~/components/sections/board/BoardsList.vue';
import TheProfile from '~/components/shared/TheProfile.vue';
</script>
