<template>
  <div class="flex flex-nowrap gap-8">
    <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800">
      c {{ DatetimeUtility.format(from, format) }}
    </UIBadge>
    <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800">
      до {{ DatetimeUtility.format(to, format) }}
    </UIBadge>
  </div>
</template>

<script setup lang="ts">
import { DatetimeUtility, EColor, type TDatetimeFormat } from '@kanban-board/common';

import UIBadge from '~/components/ui/UIBadge.vue';

const props = withDefaults(
  defineProps<{
    from: Date;
    to: Date;
    withTime?: boolean;
  }>(),
  {
    withTime: false,
  },
);

const format = computed<TDatetimeFormat>(() => (props.withTime ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY'));
</script>
