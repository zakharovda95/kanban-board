<template>
  <div class="size-fit">
    <UIIconButton
      :icon="icon || 'more-2-fill'"
      :icon-size="iconSize"
      @click:button="isContextMenuOpen = !isContextMenuOpen"
    />
    <Transition name="fade">
      <div
        v-if="isContextMenuOpen"
        ref="contextMenuRef"
        class="border-light-300 bg-light-200 rounded-8 max-size-200 absolute z-2 mt-8 size-fit border p-8"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

withDefaults(
  defineProps<{
    icon?: 'more-1-fill' | 'more-2-fill';
    iconSize?: number;
  }>(),
  {
    icon: 'more-2-fill',
    iconSize: 16,
  },
);

const contextMenuRef = useTemplateRef('contextMenuRef');
const isContextMenuOpen = ref(false);

onClickOutside(contextMenuRef, () => {
  isContextMenuOpen.value = false;
});
</script>
