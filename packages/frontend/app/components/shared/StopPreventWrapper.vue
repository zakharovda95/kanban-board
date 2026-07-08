<template>
  <Component :is="tag" @click.stop.prevent>
    <slot />
  </Component>
</template>

<script setup lang="ts">
import { ETag } from '~/enums/global.enums';

withDefaults(defineProps<{ tag?: ETag.DIV | ETag.SPAN }>(), { tag: ETag.DIV });
</script>
