<template>
  <article
    class="issue-card rounded-8 bg-light-base flex h-fit w-full cursor-pointer flex-col gap-8 border border-transparent p-8 duration-300"
  >
    <header class="flex w-full justify-between gap-8">
      <div class="flex flex-1 flex-col gap-4">
        <div class="flex flex-nowrap gap-4">
          <UIBadge :background-color="color" :color="color ? ColorUtility.getTextColor(color, 170) : EColor.LIGHT_BASE">
            #100
          </UIBadge>
          <UIBadge :background-color="EColor.RED">Просрочена</UIBadge>
        </div>

        <div class="text-12 flex gap-2">
          <NuxtTime
            :datetime="issue.createdAt"
            class="font-medium tabular-nums"
            day="numeric"
            month="numeric"
            year="numeric"
          />
          <span class="italic">(43 дня)</span>
        </div>
      </div>
    </header>

    <div>
      <h4 class="text-14 font-medium">{{ issue.title }}</h4>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ColorUtility, EColor, type TIssue } from '@kanban-board/common';

const props = withDefaults(
  defineProps<{
    color?: string;
    issue: TIssue;
  }>(),
  {
    color: EColor.GREEN,
  },
);

const computedColor = computed(() => props.color || EColor.GREEN);
</script>

<style scoped>
.issue-card:hover {
  border-color: v-bind(computedColor);
}
</style>
