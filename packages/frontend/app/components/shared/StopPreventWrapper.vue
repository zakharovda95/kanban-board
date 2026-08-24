<template>
  <Component :is="tag" @click.stop.prevent>
    <slot />
  </Component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: 'div' | 'span';
  }>(),
  {
    tag: 'div',
  },
);
</script>
