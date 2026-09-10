<template>
  <UIButtonWithContextMenu ref="buttonWithContextMenuRef" :background-color="buttonBackgroundColor" size="small">
    <div class="grid gap-4" :style="{ gridTemplateColumns: computedGridCols }">
      <UIIconButton
        v-for="action in actions"
        :key="action.action"
        :background-color="action.backgroundColor"
        :color="action.color"
        :icon="action.icon"
        :disabled="action.disabled"
        size="small"
        @click:button="onClick(action.handler)"
      />
    </div>
  </UIButtonWithContextMenu>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import type { TActionButtonData } from '~/types/shared.types';

import UIButtonWithContextMenu from '~/components/ui/buttons/UIButtonWithContextMenu.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const props = withDefaults(
  defineProps<{
    actions?: TActionButtonData[];
    buttonBackgroundColor?: EColor;
    gridTemplateColumns?: number;
  }>(),
  {
    actions: () => [],
    buttonBackgroundColor: EColor.LIGHT_200,
    gridTemplateColumns: 2,
  },
);

const buttonWithContextMenuRef = useTemplateRef('buttonWithContextMenuRef');

const computedGridCols = computed(() => `repeat(${props.gridTemplateColumns}, 1fr)`);

const closeContextMenu = () => {
  buttonWithContextMenuRef.value?.closeContextMenu();
};

const onClick = (handler: () => void | Promise<void>): void => {
  handler?.();
  closeContextMenu();
};

onBeforeUnmount(() => {
  closeContextMenu();
});
</script>
