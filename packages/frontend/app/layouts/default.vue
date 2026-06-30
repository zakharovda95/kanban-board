<template>
  <div class="flex h-full min-h-screen flex-col">
    <TheHeader />

    <div class="h-full flex-1">
      <slot />
    </div>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import TheFooter from '~/components/layouts/TheFooter.vue';
import TheHeader from '~/components/layouts/TheHeader.vue';
</script>
