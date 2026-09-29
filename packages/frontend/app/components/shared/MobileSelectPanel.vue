<template>
  <div class="h-auto w-full p-12">
    <div class="rounded-8 bg-light-base flex h-max w-full items-center gap-8 p-8">
      <UIIconButton
        :icon="buttonIcon"
        :background-color="EColor.LIGHT_200"
        :color="EColor.LIGHT_800"
        @click:button="isOpen = true"
      />

      <div v-if="isLoading" class="flex flex-1 items-center justify-center">
        <UILoader :size="EIconSizeSmall.MEDIUM" />
      </div>
      <UITooltip v-else class="w-full" :text="tooltipText">
        <div class="bg-light-100 rounded-6 flex h-32 w-[calc(100%-64px)] flex-1 items-center justify-center px-12 py-6">
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
      </UITooltip>
    </div>

    <UIModal v-model:is-open="isOpen" :title="modalTitle">
      <slot />
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { EIconSizeSmall } from '~/enums/global.enums.ts';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UILoader from '~/components/ui/loaders/UILoader.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';
import UITooltip from '~/components/ui/UITooltip.vue';

withDefaults(
  defineProps<{
    buttonIcon: string;
    selectedTitle?: string | null;
    deselectedTitle?: string | null;
    modalTitle: string;
    isLoading?: boolean;
    color?: string | null;
    tooltipText?: string | null;
  }>(),
  {
    selectedTitle: null,
    deselectedTitle: null,
    isLoading: false,
    color: null,
    tooltipText: null,
  },
);

const isOpen = defineModel<boolean>('isOpen', { required: true });
</script>
