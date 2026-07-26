<template>
  <UIButtonWithContextMenu ref="buttonWithContextMenuRef">
    <div class="flex flex-row flex-nowrap items-center justify-center gap-4">
      <UIIconButton :background-color="EColor.ORANGE" icon="pencil-line" @click:button="onClick('update')" />
      <UIIconButton :background-color="EColor.RED" icon="delete-2-line" @click:button="onClick('delete')" />
      <UIIconButton
        v-if="showMoveButton"
        :background-color="EColor.GREEN"
        icon="move-line"
        @click:button="onClick('move')"
      />
    </div>
  </UIButtonWithContextMenu>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import type { TBaseAction } from '~/types/shared.types';

import UIButtonWithContextMenu from '~/components/ui/buttons/UIButtonWithContextMenu.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

withDefaults(
  defineProps<{
    showMoveButton?: boolean;
  }>(),
  {
    showMoveButton: false,
  },
);

const emit = defineEmits<{
  'update': [];
  'delete': [];
  'move': [];
}>();

const buttonWithContextMenuRef = useTemplateRef('buttonWithContextMenuRef');

const onClick = (action: TBaseAction): void => {
  const actionMap: Record<TBaseAction, () => void> = {
    update: () => emit('update'),
    delete: () => emit('delete'),
    move: () => emit('move'),
  };

  actionMap[action]();
  buttonWithContextMenuRef.value?.closeContextMenu();
};
</script>
