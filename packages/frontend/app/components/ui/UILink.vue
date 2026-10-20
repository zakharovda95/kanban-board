<template>
  <Component
    :is="resolvedTag"
    v-bind="resolvedAttributes"
    class="flex flex-nowrap items-center justify-start gap-4 whitespace-nowrap"
    :class="[
      {
        'hover:opacity-50': hoverable,
        'underline': isActive && !renderless,
        'text-light-700 decoration-green cursor-pointer leading-none font-medium whitespace-nowrap decoration-3 underline-offset-6 duration-300':
          !renderless,
      },
    ]"
  >
    <div v-if="icon" :class="`size-${iconSize}`">
      <NuxtIcon :name="icon" :size="iconSize" />
    </div>

    <slot v-if="slots.default" />
  </Component>
</template>

<script setup lang="ts">
import type { RouteLocation } from 'vue-router';

import { EIconSize, type EIconSizeSmall } from '~/enums/global.enums';
import { isExternalLink } from '~/utilities/link.utilities';

import { NuxtLink } from '#components';

const slots = useSlots();

const props = withDefaults(
  defineProps<{
    to: string | RouteLocation;
    tag?: 'a' | 'NuxtLink' | 'span';
    icon?: string | null;
    iconSize?: EIconSize | EIconSizeSmall | number;
    hoverable?: boolean;
    isActive?: boolean;
    renderless?: boolean;
  }>(),
  {
    tag: 'NuxtLink',
    icon: null,
    iconSize: EIconSize.LARGE,
    hoverable: true,
    isActive: false,
    renderless: false,
  },
);

const resolvedTag = computed(() => {
  if (!props.to) return 'span';
  if (props.tag === 'NuxtLink') return isExternalLink(props.to) ? 'a' : NuxtLink;
  return props.tag;
});

const resolvedAttributes = computed(() =>
  isExternalLink(props.to) || props.tag === 'a' ? { href: props.to } : { to: props.to },
);
</script>
