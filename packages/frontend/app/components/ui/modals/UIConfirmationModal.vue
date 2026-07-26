<template>
  <UIModal
    :is-open="isOpen"
    :title="title"
    :close-on-overlay="closeOnOverlay"
    hide-close-button
    @update:is-open="emit('update:is-open', $event)"
  >
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

import { ESize } from '~/enums/global.enums';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';

withDefaults(
  defineProps<{
    isOpen: boolean;
    title?: string | null;
    text: string;
    closeOnOverlay?: boolean;
    actionButtonLabel?: string;
    disabled?: boolean;
  }>(),
  {
    title: null,
    closeOnOverlay: true,
    actionButtonLabel: 'Применить',
    disabled: false,
  },
);

const emit = defineEmits<{
  'click:confirm': [];
  'click:reset': [];
  'update:is-open': [value: boolean];
}>();

const reset = () => {
  emit('click:reset');
  emit('update:is-open', false);
};
</script>
