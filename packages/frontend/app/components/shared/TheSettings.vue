<template>
  <div class="size-fit">
    <UIIconButton
      :background-color="backgroundColor"
      :color="color"
      :size="size"
      icon="mingcute:settings-5-line"
      icon-class="rotate-0 scale-100 group-hover:rotate-45 group-hover:scale-120"
      @click="isModalOpen = true"
    />

    <UIModal v-model:is-open="isModalOpen" title="Настройки приложения">
      <div class="bg-light-200 rounded-8 text-14 flex w-280 items-center justify-center p-20">
        Тут будут настройки приложения
      </div>
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import type { TSize } from '~/types/ui.types.ts';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';

withDefaults(
  defineProps<{
    backgroundColor?: EColor;
    color?: EColor;
    size?: TSize;
  }>(),
  {
    backgroundColor: EColor.LIGHT_BASE,
    color: EColor.LIGHT_500,
    size: 'medium',
  },
);

const isModalOpen = ref(false);
</script>
