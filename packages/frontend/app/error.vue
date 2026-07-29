<template>
  <div>Произошла ошибка {{ error.status }} {{ error.message }}</div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{ error: NuxtError }>();
</script>
