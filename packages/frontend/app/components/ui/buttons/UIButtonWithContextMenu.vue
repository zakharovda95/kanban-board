<template>
  <div ref="contextMenuRef" class="size-fit">
    <UIIconButton
      v-bind="$attrs"
      :icon="icon || 'more-1-fill'"
      :size="size"
      :icon-size="iconSize"
      :background-color="backgroundColor"
      :color="color"
      @click:button="isContextMenuOpen = !isContextMenuOpen"
    />
    <Transition name="fade">
      <div
        v-if="isContextMenuOpen"
        class="border-light-200 bg-light-base rounded-6 max-size-200 absolute z-2 mt-8 size-fit border p-8"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { EColor, EIconSize, ESize } from '~/enums/global.enums';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    icon?: 'more-1-fill' | 'more-2-fill';
    size?: ESize;
    iconSize?: number;
    backgroundColor?: EColor;
    color?: EColor;
  }>(),
  {
    icon: 'more-1-fill',
    size: ESize.SMALL,
    iconSize: EIconSize.SMALL,
    backgroundColor: EColor.LIGHT_200,
    color: EColor.LIGHT_800,
  },
);

const contextMenuRef = useTemplateRef('contextMenuRef');
const isContextMenuOpen = ref(false);

const closeContextMenu = () => {
  isContextMenuOpen.value = false;
};

onClickOutside(contextMenuRef, () => {
  closeContextMenu();
});

defineExpose({
  closeContextMenu,
});
</script>
