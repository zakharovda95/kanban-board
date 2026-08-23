<template>
  <VueFinalModal
    v-model="isOpen"
    :teleport-to="options.teleportTo"
    :display-directive="options.displayDirective"
    :hide-overlay="options.hideOverlay"
    :overlay-transition="options.overlayTransition"
    :content-transition="options.contentTransition"
    :click-to-close="options.clickToClose"
    :esc-to-close="options.escToClose"
    :background="options.background"
    :lock-scroll="options.lockScroll"
    :reserve-scroll-bar-gap="options.reserveScrollBarGap"
    :swipe-to-close="options.swipeToClose"
    class="flex items-center justify-center p-12"
    overlay-class="bg-light-black-opacity"
    :content-class="[
      'bg-light-base rounded-12 laptop:max-w-[80%] relative size-fit max-h-[80%] max-w-full p-12',
      bodyClass,
    ]"
  >
    <header v-if="title || slots.header" class="mb-12 flex w-full items-center justify-between gap-8">
      <slot name="header">
        <h4 class="text-18 font-medium">{{ title }}</h4>
      </slot>
    </header>

    <UIIconButton
      v-if="!hideCloseButton"
      :background-color="EColor.LIGHT_200"
      :color="EColor.LIGHT_800"
      class="absolute right-0 bottom-[calc(100%+8px)] duration-300 hover:scale-110"
      icon="close-line"
      @click:button="isOpen = false"
    />

    <div class="flex-1">
      <slot />
    </div>

    <footer v-if="slots.footer" class="mt-12">
      <slot name="footer" />
    </footer>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import { EColor } from '@kanban-board/common';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const slots = defineSlots();

const isOpen = defineModel<boolean>('isOpen', { required: true });

const props = withDefaults(
  defineProps<{
    bodyClass?: string | null;
    title?: string | null;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    hideCloseButton?: boolean;
  }>(),
  {
    bodyClass: null,
    title: null,
    closeOnOverlay: false,
    closeOnEsc: true,
    hideCloseButton: false,
  },
);

const options = ref({
  teleportTo: '#teleports',
  displayDirective: 'if' as const,
  hideOverlay: false,
  overlayTransition: 'vfm-fade',
  contentTransition: 'vfm-fade',
  clickToClose: props.closeOnOverlay,
  escToClose: props.closeOnEsc,
  background: 'non-interactive' as const,
  lockScroll: true,
  reserveScrollBarGap: true,
  swipeToClose: 'none' as const,
});
</script>
