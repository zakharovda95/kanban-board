<template>
  <div class="flex flex-wrap items-center gap-8">
    <Component :is="resolvedComponent" v-if="createdAt" v-bind="resolvedAttributes">
      <span v-if="variant === 'details'">Создано: </span><NuxtTime :datetime="createdAt" />
      <span
        v-if="daysPassedSinceCreation"
        class="italic"
        :class="{
          'text-green!': daysPassedSinceCreation === 'сегодня',
          'text-orange!': daysPassedSinceCreation === 'вчера',
        }"
      >
        ({{ daysPassedSinceCreation }})
      </span>
    </Component>

    <Component :is="resolvedComponent" v-if="updatedAt" v-bind="resolvedAttributes">
      <span v-if="variant === 'details'">Обновлено:</span> <NuxtTime :datetime="updatedAt" />
      <span
        v-if="daysPassedSinceUpdating"
        class="italic"
        :class="{
          'text-green!': daysPassedSinceUpdating === 'сегодня',
          'text-orange!': daysPassedSinceUpdating === 'вчера',
        }"
      >
        ({{ daysPassedSinceUpdating }})
      </span>
    </Component>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import UIBadge from '~/components/ui/UIBadge.vue';

const props = withDefaults(
  defineProps<{
    variant?: 'card' | 'details';
    createdAt?: Date | string | null;
    daysPassedSinceCreation?: number | string | null;
    updatedAt?: Date | string | null;
    daysPassedSinceUpdating?: number | string | null;
  }>(),
  {
    variant: 'card',
    createdAt: null,
    daysPassedSinceCreation: null,
    updatedAt: null,
    daysPassedSinceUpdating: null,
  },
);

const resolvedComponent = computed(() => (props.variant === 'card' ? 'div' : UIBadge));

const resolvedAttributes = computed(() => {
  if (props.variant === 'card') return { class: 'text-12 text-light-800 flex gap-2' };

  return {
    size: 'medium',
    backgroundColor: EColor.LIGHT_200,
    color: EColor.LIGHT_800,
  };
});
</script>
