<template>
  <NuxtLoadingIndicator :height="3" :duration="3000" color="#18a058" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ClientOnly>
    <ModalsContainer />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
</script>
