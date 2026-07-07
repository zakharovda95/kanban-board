<template>
  <article class="rounded-8 border-light-300 h-fit w-full border p-8">
    {{ issue }}
  </article>
</template>

<script setup lang="ts">
import type { TIssue } from '@kanban-board/common';
defineProps<{
  issue: TIssue;
}>();
</script>
