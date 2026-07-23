<template>
  <Transition
    name="animated-height"
    @enter="onEnter"
    @before-enter="onBeforeEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave"
    @before-leave="onBeforeLeave"
    @after-leave="onAfterLeave"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import type { TUIAnimatedHeightHook } from '~/types/ui.types.ts';

const onBeforeEnter: TUIAnimatedHeightHook = element => {
  if (!element) return;
  (element as HTMLElement).style.height = '0';
};

const onEnter: TUIAnimatedHeightHook = element => {
  if (!element) return;
  (element as HTMLElement).style.height = `${element.scrollHeight}px`;
};

const onAfterEnter: TUIAnimatedHeightHook = element => {
  if (!element) return;
  (element as HTMLElement).style.height = 'auto';
};

const onBeforeLeave: TUIAnimatedHeightHook = element => {
  if (!element) return;
  (element as HTMLElement).style.height = `${element.scrollHeight}px`;
};

const onLeave: TUIAnimatedHeightHook = element => {
  if (!element) return;
  void (element as HTMLElement).offsetHeight;
  (element as HTMLElement).style.height = '0';
};

const onAfterLeave: TUIAnimatedHeightHook = element => {
  if (!element) return;
  (element as HTMLElement).style.height = 'auto';
};
</script>

<style scoped>
.animated-height-enter-from,
.animated-height-leave-to {
  height: 0;
  opacity: 0;
}

.animated-height-enter-active,
.animated-height-leave-active {
  overflow: hidden;
  transition:
    height 0.5s ease,
    opacity 0.5s ease;
}
</style>
