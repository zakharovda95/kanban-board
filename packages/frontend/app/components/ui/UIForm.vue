<template>
  <form class="flex w-fit flex-col gap-12" :class="{ 'w-full!': full }" @submit.prevent="emit('submit:form')">
    <slot v-if="title || slots.title" name="title">
      <h4 class="font-medium">{{ title }}</h4>
    </slot>

    <div class="flex w-full flex-col gap-8">
      <slot />
    </div>

    <div
      class="flex w-full flex-col gap-8"
      :class="[isColButtonsPosition ? 'laptop:flex-col' : 'laptop:flex-row-reverse']"
    >
      <slot name="bottom">
        <UIButton
          class="w-full"
          :class="isColButtonsPosition ? 'laptop:w-full' : 'laptop:flex-1 laptop:w-auto'"
          type="submit"
          :size="buttonsSize"
          :disabled="disabled"
        >
          {{ actionButtonLabel }}
        </UIButton>
        <UIButton
          class="w-full"
          :class="isColButtonsPosition ? 'laptop:w-full' : 'laptop:w-fit'"
          :size="buttonsSize"
          :background-color="EColor.RED"
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
import type { TUIFormButtonsPosition } from '~/types/ui.types.ts';

import UIButton from '~/components/ui/buttons/UIButton.vue';

const slots = defineSlots();

const props = withDefaults(
  defineProps<{
    title?: string | null;
    actionButtonLabel?: string;
    buttonsSize?: ESize;
    full?: boolean;
    disabled?: boolean;
    buttonsPosition?: TUIFormButtonsPosition;
  }>(),
  {
    title: null,
    actionButtonLabel: ACTION_BUTTON_LABEL,
    buttonsSize: ESize.SMALL,
    buttonsPosition: 'column',
    full: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  'submit:form': [];
  'reset:form': [];
}>();

const isColButtonsPosition = computed(() => props.buttonsPosition === 'column');
</script>
