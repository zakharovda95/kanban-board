<template>
  <div class="size-fit">
    <UIIconButton
      :background-color="EColor.LIGHT_BASE"
      :color="EColor.LIGHT_500"
      :size="ESize.MEDIUM"
      icon="settings-5-line"
      icon-class="rotate-0 scale-100 group-hover:rotate-45 group-hover:scale-120"
      @click="isModalOpen = true"
    />

    <UIModal v-model:is-open="isModalOpen" title="Настройки приложения">
      <div class="р-80 flex w-280 items-center justify-center">Тут будут настройки приложения</div>
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { ESize } from '~/enums/global.enums';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';

const isModalOpen = ref(false);
</script>
