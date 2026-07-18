<template>
  <div class="flex h-screen flex-col">
    <TheHeader />

    <main class="flex flex-1">
      <slot />
    </main>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import TheFooter from '~/components/layouts/shared/TheFooter.vue';
import TheHeader from '~/components/layouts/shared/TheHeader.vue';
</script>
