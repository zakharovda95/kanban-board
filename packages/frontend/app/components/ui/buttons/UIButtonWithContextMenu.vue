<template>
  <div ref="contextMenuRef" class="size-fit">
    <div ref="buttonRef">
      <UIIconButton
        v-bind="$attrs"
        :class="{ 'brightness-95': isContextMenuOpen }"
        :icon="icon || 'mingcute:more-1-fill'"
        :size="size"
        :icon-size="iconSize"
        :background-color="backgroundColor"
        :color="color"
        :disabled="disabled"
        @click:button="isContextMenuOpen = !isContextMenuOpen"
      />
    </div>
    <Transition name="menu-fade">
      <div
        v-if="isContextMenuOpen"
        ref="menuRef"
        :style="{ ...floatingStyles }"
        class="border-light-200 bg-light-base rounded-6 max-size-200 z-2 size-fit border p-8"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';
import { EColor } from '@kanban-board/common';

import { EIconSize } from '~/enums/global.enums';
import type { TSize } from '~/types/ui.types.ts';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    icon?: 'mingcute:more-1-fill' | 'mingcute:more-2-fill';
    size?: TSize;
    iconSize?: number;
    backgroundColor?: EColor;
    color?: EColor;
    disabled?: boolean;
  }>(),
  {
    icon: 'mingcute:more-1-fill',
    size: 'medium',
    iconSize: EIconSize.SMALL,
    backgroundColor: EColor.LIGHT_200,
    color: EColor.LIGHT_800,
    disabled: false,
  },
);

const contextMenuRef = useTemplateRef('contextMenuRef');
const buttonRef = useTemplateRef('buttonRef');
const menuRef = useTemplateRef('menuRef');
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

const { floatingStyles } = useFloating(buttonRef, menuRef, {
  placement: 'bottom-start',
  whileElementsMounted: autoUpdate,
  middleware: [offset(8), flip(), shift()],
});
</script>
