<template>
  <article
    class="rounded-8 hover:border-green bg-light-base flex h-fit w-full cursor-pointer flex-col gap-8 border border-transparent p-8 duration-300"
  >
    <div class="flex w-full items-center justify-between gap-4">
      <UIBadge append-icon="copy-line">Задача #{{ issue.id }}</UIBadge>
      <span class="text-12 tabular-nums">{{ dayjs(issue.createdAt).format('DD.MM.YYYY') }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { TIssue } from '@kanban-board/common';
import dayjs from 'dayjs';
defineProps<{
  issue: TIssue;
}>();
</script>
