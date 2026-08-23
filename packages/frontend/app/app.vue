<template>
  <NuxtLoadingIndicator :height="3" :duration="3000" color="#18a058" error-color="#d03050" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ModalsContainer />
</template>

<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
</script>
