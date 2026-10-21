<template>
  <form class="flex w-fit flex-col gap-12" :class="{ 'w-full!': full }" @submit.prevent="emit('submit:form')">
    <slot v-if="title || slots.title" name="title" v-bind="{ title }">
      <h4 class="text-18 font-medium">{{ title }}</h4>
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
          :append-icon="actionButtonIcon"
        >
          {{ actionButtonLabel }}
        </UIButton>
        <UIButton
          v-if="!hideRejectButton"
          class="w-full"
          :class="isColButtonsPosition ? 'laptop:w-full' : 'laptop:w-fit min-w-120'"
          :size="buttonsSize"
          :background-color="EColor.RED"
          :append-icon="rejectButtonIcon"
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

import type { TSize, TUIFormButtonsPosition } from '~/types/ui.types.ts';

import UIButton from '~/components/ui/buttons/UIButton.vue';

const slots = defineSlots();

const props = withDefaults(
  defineProps<{
    title?: string | null;
    actionButtonLabel?: string;
    actionButtonIcon?: string | null;
    rejectButtonIcon?: string | null;
    buttonsSize?: TSize;
    full?: boolean;
    disabled?: boolean;
    buttonsPosition?: TUIFormButtonsPosition;
    hideRejectButton?: boolean;
  }>(),
  {
    title: null,
    actionButtonLabel: 'Применить',
    actionButtonIcon: null,
    rejectButtonIcon: null,
    buttonsSize: 'medium',
    buttonsPosition: 'column',
    full: false,
    disabled: false,
    hideRejectButton: false,
  },
);

const emit = defineEmits<{
  'submit:form': [];
  'reset:form': [];
}>();

const isColButtonsPosition = computed(() => props.buttonsPosition === 'column');
</script>
