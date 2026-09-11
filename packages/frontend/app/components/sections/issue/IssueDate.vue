<template>
  <div class="flex flex-wrap items-center gap-8">
    <template v-for="item in dateItems" :key="item.key">
      <div v-if="variant === 'card'" class="text-12 text-light-800 flex items-center gap-2">
        <NuxtTime :datetime="item.datetime" />
        <UITooltip v-if="item.daysPassed" :text="String(item.daysPassed)" size="small" @click.stop />
      </div>
      <UITooltip v-else-if="item.daysPassed" :text="String(item.daysPassed)">
        <UIBadge v-bind="detailsBadgeProps" class="cursor-help">
          {{ item.label }} <NuxtTime :datetime="item.datetime" />
        </UIBadge>
      </UITooltip>
      <UIBadge v-else v-bind="detailsBadgeProps">
        {{ item.label }}
        <NuxtTime :datetime="item.datetime" />
      </UIBadge>
    </template>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import UIBadge from '~/components/ui/UIBadge.vue';
import UITooltip from '~/components/ui/UITooltip.vue';

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

const detailsBadgeProps = {
  size: 'medium' as const,
  backgroundColor: EColor.LIGHT_200,
  color: EColor.LIGHT_800,
};

const dateItems = computed(() => {
  const items: {
    key: string;
    label: string;
    datetime: Date | string;
    daysPassed: number | string | null;
  }[] = [];

  if (props.createdAt) {
    items.push({
      key: 'created',
      label: 'Создано:',
      datetime: props.createdAt,
      daysPassed: props.daysPassedSinceCreation,
    });
  }

  if (props.updatedAt) {
    items.push({
      key: 'updated',
      label: 'Обновлено:',
      datetime: props.updatedAt,
      daysPassed: props.daysPassedSinceUpdating,
    });
  }

  return items;
});
</script>
