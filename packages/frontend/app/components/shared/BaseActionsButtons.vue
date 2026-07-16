<template>
  <UIButtonWithContextMenu>
    <div class="flex flex-row flex-nowrap items-center justify-center gap-4">
      <UIIconButton class="bg-orange text-light-base" icon="pencil-line" @click:button="emit('edit')" />
      <UIIconButton class="bg-red text-light-base" icon="delete-2-line" @click:button="emit('delete')" />
    </div>
  </UIButtonWithContextMenu>
</template>

<script setup lang="ts">
import UIButtonWithContextMenu from '~/components/ui/buttons/UIButtonWithContextMenu.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const emit = defineEmits<{
  'edit': [];
  'delete': [];
}>();
</script>
