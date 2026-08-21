<template>
  <div class="laptop:justify-between flex h-full items-center justify-start gap-8 overflow-hidden">
    <!-- TODO: не появляются ... при оверфлоу, подумать мб передавать max-w-calc через пропс -->
    <div
      class="laptop:justify-start flex flex-col items-start justify-center text-left"
      :class="{ 'max-w-[calc(100%-32px)]': !withoutActions }"
    >
      <p class="text-14 block overflow-hidden leading-18 font-medium text-ellipsis whitespace-nowrap">
        {{ column.title }}
      </p>
      <p
        v-if="column.description"
        class="text-elipsis text-12 block w-full overflow-hidden leading-16 font-light whitespace-nowrap"
      >
        {{ column.description }}
      </p>
    </div>

    <!-- TODO: вынести из компонента -->
    <StopPreventWrapper v-if="!withoutActions">
      <ColumnActionsButtons
        :column="column"
        @update:column="emit('update:column', $event)"
        @delete:column="emit('delete:column', $event)"
      />
    </StopPreventWrapper>
  </div>
</template>

<script setup lang="ts">
import type { TColumn, TDeleteColumnEmitPayload } from '@kanban-board/common';

import ColumnActionsButtons from '~/components/sections/column/ColumnActionsButtons.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';

withDefaults(
  defineProps<{
    column: TColumn;
    withoutActions?: boolean;
  }>(),
  {
    withoutActions: false,
  },
);

const emit = defineEmits<{
  'update:column': [payload: TColumn];
  'delete:column': [payload: TDeleteColumnEmitPayload];
}>();
</script>
