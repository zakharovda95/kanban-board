<template>
  <nav class="flex w-fit items-center justify-center gap-12">
    <UILink
      icon="icons:github"
      tag="a"
      to="https://github.com/zakharovda95/kanban-board"
      target="_blank"
      :icon-size="size"
    />

    <UILink icon="icons:telegram" tag="a" to="https://t.me/zakharovda95" target="_blank" :icon-size="size" />
  </nav>
</template>

<script setup lang="ts">
import UILink from '~/components/ui/UILink.vue';

withDefaults(
  defineProps<{
    size?: number;
  }>(),
  {
    size: 32,
  },
);
</script>
