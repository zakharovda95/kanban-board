<template>
  <NuxtLoadingIndicator :height="3" :duration="3000" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ModalsContainer />
</template>

<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
</script>
