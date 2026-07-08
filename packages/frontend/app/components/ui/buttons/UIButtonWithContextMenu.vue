<template>
  <div ref="contextMenuRef" class="size-fit">
    <UIIconButton
      v-bind="$attrs"
      :icon="icon || 'more-1-fill'"
      :size="size"
      :icon-size="iconSize"
      @click:button="isContextMenuOpen = !isContextMenuOpen"
    />
    <Transition name="fade">
      <div
        v-if="isContextMenuOpen"
        class="border-light-300 bg-light-200 rounded-8 max-size-200 absolute z-2 mt-8 size-fit border p-8"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { EIconSize, ESize } from '~/enums/global.enums';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    icon?: 'more-1-fill' | 'more-2-fill';
    size?: ESize;
    iconSize?: number;
  }>(),
  {
    icon: 'more-1-fill',
    size: ESize.SMALL,
    iconSize: EIconSize.SMALL,
  },
);

const contextMenuRef = useTemplateRef('contextMenuRef');
const isContextMenuOpen = ref(false);

onClickOutside(contextMenuRef, () => {
  isContextMenuOpen.value = false;
});
</script>
