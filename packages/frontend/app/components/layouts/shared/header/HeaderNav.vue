<template>
  <nav class="laptop:flex-row laptop:items-center flex-start laptop:gap-36 mb-4 flex flex-col gap-24">
    <UILink to="/boards" :is-active="route.name === 'boards' || route.name === 'boards-id'">Доски</UILink>
    <UILink to="/docs" :is-active="route.name === 'docs'">Документация</UILink>
    <UILink to="/about" :is-active="route.name === 'about'">О проекте</UILink>
  </nav>
</template>

<script setup lang="ts">
import UILink from '~/components/ui/UILink.vue';

const route = useRoute();
</script>
