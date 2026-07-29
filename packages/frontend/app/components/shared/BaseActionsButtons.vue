<template>
  <UIButtonWithContextMenu ref="buttonWithContextMenuRef" :background-color="buttonBackgroundColor">
    <div class="grid grid-cols-2 gap-4">
      <UIIconButton
        v-for="action in computedActions"
        :key="action.action"
        :background-color="action.backgroundColor"
        :color="action.color"
        :icon="action.icon"
        @click:button="onClick(action.action)"
      />
    </div>
  </UIButtonWithContextMenu>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { BASE_ACTIONS_BUTTONS_DATA } from '~/constants/shared.constants';
import type { TBaseAction, TBaseActionButtonData } from '~/types/shared.types';

import UIButtonWithContextMenu from '~/components/ui/buttons/UIButtonWithContextMenu.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const props = withDefaults(
  defineProps<{
    actions?: TBaseAction[];
    buttonBackgroundColor?: EColor;
  }>(),
  {
    actions: () => ['update', 'delete'],
    buttonBackgroundColor: EColor.LIGHT_200,
  },
);

const emit = defineEmits<{
  'update': [];
  'delete': [];
  'move': [];
  'copy': [];
  'share': [];
  'setup': [];
}>();

const buttonWithContextMenuRef = useTemplateRef('buttonWithContextMenuRef');

const computedActions = computed(() => {
  const buttonData: TBaseActionButtonData[] = [];

  for (const action of props.actions) {
    const data = BASE_ACTIONS_BUTTONS_DATA[action];
    if (!data) continue;
    buttonData.push(data);
  }

  return buttonData;
});

const onClick = (action: TBaseAction): void => {
  const actionMap: Record<TBaseAction, () => void> = {
    update: () => emit('update'),
    delete: () => emit('delete'),
    move: () => emit('move'),
    copy: () => emit('copy'),
    share: () => emit('share'),
    setup: () => emit('setup'),
  };

  actionMap[action]();
  buttonWithContextMenuRef.value?.closeContextMenu();
};

onBeforeUnmount(() => {
  buttonWithContextMenuRef.value?.closeContextMenu();
});
</script>
