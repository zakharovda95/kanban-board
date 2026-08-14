<template>
  <div
    class="w-full border-t bg-transparent"
    :style="{ height: `${height}px`, borderTopWidth: height, borderTopStyle: variant, borderTopColor: color }"
  />
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

withDefaults(
  defineProps<{
    height?: number;
    color?: EColor;
    variant?: 'solid' | 'dotted' | 'dashed';
  }>(),
  {
    height: 1,
    color: EColor.LIGHT_200,
    variant: 'solid',
  },
);
</script>
