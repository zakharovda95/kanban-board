<template>
  <div class="flex w-fit flex-row items-center justify-center gap-4 p-2" :class="{ 'size-full!': full }">
    <NuxtIcon class="animate-spin" :name="variant ?? 'mingcute:loading-line'" :size="size" />
  </div>
</template>

<script setup lang="ts">
import type { EIconSizeSmall } from '~/enums/global.enums';
import { EIconSize } from '~/enums/global.enums';

withDefaults(
  defineProps<{
    size?: EIconSize | EIconSizeSmall | number;
    full?: boolean;
    variant?: 'mingcute:loading-3-line' | 'mingcute:loading-line';
  }>(),
  {
    size: EIconSize.LARGE,
    full: false,
    variant: 'mingcute:loading-line',
  },
);
</script>
