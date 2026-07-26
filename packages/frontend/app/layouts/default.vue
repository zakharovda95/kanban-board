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
import TheHeader from '~/components/layouts/shared/header/TheHeader.vue';
import TheFooter from '~/components/layouts/shared/TheFooter.vue';
</script>
