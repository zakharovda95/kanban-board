<template>
  <div class="bg-light-200 rounded-2 flex w-fit items-center justify-center py-4 duration-300 hover:brightness-95">
    <NuxtIcon name="mingcute:dots-fill" :size="size" />
  </div>
</template>

<script setup lang="ts">
import { type EIconSize, EIconSizeSmall } from '~/enums/global.enums';

withDefaults(
  defineProps<{
    size?: EIconSize | EIconSizeSmall;
  }>(),
  {
    size: EIconSizeSmall.SMALL,
  },
);
</script>
