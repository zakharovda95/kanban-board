<template>
  <UIButtonWithContextMenu ref="buttonWithContextMenuRef">
    <div class="flex flex-row flex-nowrap items-center justify-center gap-4">
      <UIIconButton :background-color="EColor.ORANGE" icon="pencil-line" @click:button="onEdit" />
      <UIIconButton :background-color="EColor.RED" icon="delete-2-line" @click:button="onDelete" />
    </div>
  </UIButtonWithContextMenu>
</template>

<script setup lang="ts">
import { EColor } from '~/enums/global.enums';

import UIButtonWithContextMenu from '~/components/ui/buttons/UIButtonWithContextMenu.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const emit = defineEmits<{
  'edit': [];
  'delete': [];
}>();

const buttonWithContextMenuRef = useTemplateRef('buttonWithContextMenuRef');

const onEdit = () => {
  emit('edit');
  buttonWithContextMenuRef.value?.closeContextMenu();
};

const onDelete = () => {
  emit('delete');
  buttonWithContextMenuRef.value?.closeContextMenu();
};
</script>
