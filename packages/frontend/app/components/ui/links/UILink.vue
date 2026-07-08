<template>
  <Component
    :is="resolvedTag"
    v-bind="isExternalLink(to) || tag === 'a' ? { to } : { href: to }"
    class="text-light-700 text-18 flex cursor-pointer flex-nowrap items-center justify-start gap-4 leading-none duration-300"
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

import { EIconSize, type EIconSizeSmall, ETag } from '~/enums/global.enums';
import { isExternalLink } from '~/utilities/link.utils';

import { NuxtLink } from '#components';

const props = withDefaults(
  defineProps<{
    to: string | RouteLocationRaw;
    tag?: ETag.A | ETag.NUXT_LINK | ETag.SPAN;
    icon?: string | null;
    iconSize?: EIconSize | EIconSizeSmall | number;
    hoverable?: boolean;
  }>(),
  {
    tag: ETag.NUXT_LINK,
    icon: null,
    iconSize: EIconSize.LARGE,
    hoverable: true,
  },
);

const resolvedTag = computed(() => {
  if (!props.to) return ETag.SPAN;
  if (props.tag === ETag.NUXT_LINK) return isExternalLink(props.to) ? ETag.A : NuxtLink;
  return props.tag;
});
</script>
