<template>
  <Component
    :is="resolvedTag"
    class="text-light-700 flex cursor-pointer flex-nowrap items-center justify-center duration-300 hover:opacity-70 gap-4"
    :class="`flex-${direction}`"
  >
    <NuxtIcon :name="`mingcute:${icon}`" :size="24" />

    <span class="text-18 font-medium">
      <slot />
    </span>
  </Component>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

import { isExternalLink } from '~/utilities/link.utils';

import { NuxtLink } from '#components';

const props = withDefaults(
  defineProps<{
    to: string | RouteLocationRaw;
    tag?: 'a' | 'NuxtLink' | 'span';
    icon?: string | null;
    direction?: 'col' | 'row' | 'row-reverse';
  }>(),
  {
    tag: 'NuxtLink',
    icon: null,
    direction: 'col',
  },
);

const resolvedTag = computed(() => {
  if (!props.to) return 'span';
  if (props.tag === 'NuxtLink') return isExternalLink(props.to) ? 'a' : NuxtLink;
  return props.tag;
});
</script>
