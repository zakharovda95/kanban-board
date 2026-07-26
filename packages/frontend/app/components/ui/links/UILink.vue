<template>
  <Component
    :is="resolvedTag"
    v-bind="resolvedAttributes"
    class="text-light-700 decoration-green flex cursor-pointer flex-nowrap items-center justify-start gap-4 leading-none font-medium decoration-3 underline-offset-8 duration-300"
    :class="[{ 'hover:opacity-50': hoverable, 'underline': isActive }]"
  >
    <div v-if="icon" :class="`size-${iconSize}`">
      <NuxtIcon :name="`mingcute:${icon}`" :size="iconSize" />
    </div>

    <slot v-if="slots.default" />
  </Component>
</template>

<script setup lang="ts">
import type { RouteLocation } from 'vue-router';

import { EIconSize, type EIconSizeSmall, ETag } from '~/enums/global.enums';
import { isExternalLink } from '~/utilities/link.utilities';

import { NuxtLink } from '#components';

const slots = useSlots();

const props = withDefaults(
  defineProps<{
    to: string | RouteLocation;
    tag?: ETag.A | ETag.NUXT_LINK | ETag.SPAN;
    icon?: string | null;
    iconSize?: EIconSize | EIconSizeSmall | number;
    hoverable?: boolean;
    isActive?: boolean;
  }>(),
  {
    tag: ETag.NUXT_LINK,
    icon: null,
    iconSize: EIconSize.LARGE,
    hoverable: true,
    isActive: false,
  },
);

const resolvedTag = computed(() => {
  if (!props.to) return ETag.SPAN;
  if (props.tag === ETag.NUXT_LINK) return isExternalLink(props.to) ? ETag.A : NuxtLink;
  return props.tag;
});

const resolvedAttributes = computed(() =>
  isExternalLink(props.to) || props.tag === ETag.A ? { href: props.to } : { to: props.to },
);
</script>
