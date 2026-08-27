<template>
  <UIButtonWithContextMenu ref="buttonWithContextMenuRef" :background-color="buttonBackgroundColor" size="small">
    <div class="grid gap-4" :style="{ gridTemplateColumns: computedGridCols }">
      <UIIconButton
        v-for="action in computedActions"
        :key="action.action"
        :background-color="action.backgroundColor"
        :color="action.color"
        :icon="action.icon"
        size="small"
        @click:button="onClick(action.action)"
      />
    </div>
  </UIButtonWithContextMenu>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import type { TAction, TActionButtonData } from '~/types/shared.types';

import UIButtonWithContextMenu from '~/components/ui/buttons/UIButtonWithContextMenu.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const props = withDefaults(
  defineProps<{
    actions?: TAction[];
    buttonBackgroundColor?: EColor;
    gridTemplateColumns?: number;
  }>(),
  {
    actions: () => ['update', 'delete'],
    buttonBackgroundColor: EColor.LIGHT_200,
    gridTemplateColumns: 2,
  },
);

const emit = defineEmits<{
  'update': [];
  'delete': [];
  'copy': [];
  'share': [];
  'setup': [];
  'moveToStart': [];
  'moveToEnd': [];
  'moveToPrevious': [];
  'moveToNext': [];
}>();

const ACTIONS_BUTTONS_DATA: Record<TAction, TActionButtonData> = {
  update: {
    action: 'update',
    icon: 'mingcute:pencil-line',
    backgroundColor: EColor.ORANGE,
    color: EColor.LIGHT_BASE,
  },
  delete: {
    action: 'delete',
    icon: 'mingcute:delete-2-line',
    backgroundColor: EColor.RED,
    color: EColor.LIGHT_BASE,
  },
  copy: {
    action: 'copy',
    icon: 'mingcute:copy-line',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  share: {
    action: 'share',
    icon: 'mingcute:share-2-line',
    backgroundColor: EColor.BLUE,
    color: EColor.LIGHT_BASE,
  },
  setup: {
    action: 'setup',
    icon: 'mingcute:settings-5-line',
    backgroundColor: EColor.LIGHT_200,
    color: EColor.LIGHT_800,
  },
  moveToStart: {
    action: 'moveToStart',
    icon: 'mingcute:arrow-to-left-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  moveToEnd: {
    action: 'moveToEnd',
    icon: 'mingcute:arrow-to-right-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  moveToPrevious: {
    action: 'moveToPrevious',
    icon: 'mingcute:align-arrow-left-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  moveToNext: {
    action: 'moveToNext',
    icon: 'mingcute:align-arrow-right-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
};

const buttonWithContextMenuRef = useTemplateRef('buttonWithContextMenuRef');

const computedActions = computed(() => {
  const buttonData: TActionButtonData[] = [];

  for (const action of props.actions) {
    const data = ACTIONS_BUTTONS_DATA[action];
    if (!data) continue;
    buttonData.push(data);
  }

  return buttonData;
});

const computedGridCols = computed(() => `repeat(${props.gridTemplateColumns}, 1fr)`);

const onClick = (action: TAction): void => {
  const actionMap: Record<TAction, () => void> = {
    update: () => emit('update'),
    delete: () => emit('delete'),
    copy: () => emit('copy'),
    share: () => emit('share'),
    setup: () => emit('setup'),
    moveToStart: () => emit('moveToStart'),
    moveToEnd: () => emit('moveToEnd'),
    moveToPrevious: () => emit('moveToPrevious'),
    moveToNext: () => emit('moveToNext'),
  };

  actionMap[action]();
  buttonWithContextMenuRef.value?.closeContextMenu();
};

onBeforeUnmount(() => {
  buttonWithContextMenuRef.value?.closeContextMenu();
});
</script>
