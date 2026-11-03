<template>
  <div class="h-auto w-full p-12">
    <UIWidget size="small" body-class="flex h-max w-full items-center gap-8" pointer @click:widget="isOpen = true">
      <UIIconButton :icon="buttonIcon" :background-color="EColor.LIGHT_200" :color="EColor.LIGHT_800" />

      <div v-if="isLoading" class="flex flex-1 items-center justify-center">
        <UISkeleton class="rounded-6 h-32 w-full" />
      </div>
      <div
        v-else
        class="bg-light-100 rounded-6 flex h-32 w-[calc(100%-64px)] flex-1 items-center justify-center px-12 py-6 select-none"
      >
        <div class="flex flex-row flex-nowrap items-center justify-center gap-8">
          <div v-if="color" class="flex size-10 shrink-0 rounded-full" :style="{ backgroundColor: color }" />
          <span
            class="text-14 block overflow-hidden text-center leading-18 font-medium text-ellipsis whitespace-nowrap"
            :class="{ 'opacity-70': Boolean(!selectedTitle && deselectedTitle) }"
          >
            {{ selectedTitle ?? deselectedTitle }}
          </span>
        </div>
      </div>
    </UIWidget>

    <UIModal v-model:is-open="isOpen" :title="modalTitle">
      <slot />
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UISkeleton from '~/components/ui/loaders/UISkeleton.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';
import UIWidget from '~/components/ui/UIWidget.vue';

const isOpen = defineModel<boolean>('isOpen', { required: true });

withDefaults(
  defineProps<{
    buttonIcon: string;
    selectedTitle?: string | null;
    deselectedTitle?: string | null;
    modalTitle: string;
    isLoading?: boolean;
    color?: string | null;
  }>(),
  {
    selectedTitle: null,
    deselectedTitle: null,
    isLoading: false,
    color: null,
  },
);
</script>
