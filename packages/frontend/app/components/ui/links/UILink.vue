<template>
  <Component
    :is="resolvedTag"
    v-bind="isExternalLink(to) || tag === 'a' ? { to } : { href: to }"
    class="text-light-700 text-18 flex cursor-pointer flex-nowrap items-center justify-start gap-4 duration-300"
    :class="[{ 'hover:opacity-80': hoverable }]"
  >
    <div v-if="icon" :class="`size-${iconSize}`">
      <NuxtIcon :name="`mingcute:${icon}`" :size="iconSize" />
    </div>

    <slot />
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
    iconSize?: number;
    hoverable?: boolean;
  }>(),
  {
    tag: 'NuxtLink',
    icon: null,
    iconSize: 24,
    hoverable: true,
  },
);

const resolvedTag = computed(() => {
  if (!props.to) return 'span';
  if (props.tag === 'NuxtLink') return isExternalLink(props.to) ? 'a' : NuxtLink;
  return props.tag;
});
</script>
