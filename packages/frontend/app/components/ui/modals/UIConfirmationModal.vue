<template>
  <UIModal v-model:is-open="isOpen" :title="title">
    <div class="w-320">
      <p class="text-14 text-light-500">{{ text }}</p>
    </div>

    <template #footer>
      <div class="flex w-full flex-col gap-8">
        <UIButton full :size="ESize.MEDIUM" :disabled="disabled" @click:button="emit('click:confirm')">
          {{ actionButtonLabel }}
        </UIButton>
        <UIButton full :size="ESize.MEDIUM" :background-color="EColor.RED" :disabled="disabled" @click:button="reset">
          Отмена
        </UIButton>
      </div>
    </template>
  </UIModal>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { ACTION_BUTTON_LABEL } from '~/constants/ui.constants';
import { ESize } from '~/enums/global.enums';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';

const isOpen = defineModel<boolean>('isOpen', { required: true });

withDefaults(
  defineProps<{
    title?: string | null;
    text: string;
    actionButtonLabel?: string;
    disabled?: boolean;
  }>(),
  {
    title: null,
    actionButtonLabel: ACTION_BUTTON_LABEL,
    disabled: false,
  },
);

const emit = defineEmits<{
  'click:confirm': [];
  'click:reset': [];
}>();

const reset = () => {
  isOpen.value = false;
  emit('click:reset');
};
</script>
