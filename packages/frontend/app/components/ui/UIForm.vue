<template>
  <form class="flex w-fit flex-col gap-12" :class="{ 'w-full!': full }" @submit.prevent="emit('submit:form')">
    <slot v-if="title || slots.title" name="title">
      <h4 class="font-medium">{{ title }}</h4>
    </slot>

    <div class="flex w-full flex-col gap-8">
      <slot />
    </div>

    <div class="flex w-full flex-col gap-8">
      <slot name="bottom">
        <UIButton type="submit" :size="buttonsSize" full :disabled="disabled">{{ actionButtonLabel }}</UIButton>
        <UIButton
          :size="buttonsSize"
          :background-color="EColor.RED"
          full
          :disabled="disabled"
          @click:button="emit('reset:form')"
        >
          Отменить
        </UIButton>
      </slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { ACTION_BUTTON_LABEL } from '~/constants/ui.constants';
import { ESize } from '~/enums/global.enums';

import UIButton from '~/components/ui/buttons/UIButton.vue';

const slots = defineSlots();

withDefaults(
  defineProps<{
    title?: string | null;
    actionButtonLabel?: string;
    buttonsSize?: ESize;
    full?: boolean;
    disabled?: boolean;
  }>(),
  {
    title: null,
    actionButtonLabel: ACTION_BUTTON_LABEL,
    buttonsSize: ESize.SMALL,
    full: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  'submit:form': [];
  'reset:form': [];
}>();
</script>
