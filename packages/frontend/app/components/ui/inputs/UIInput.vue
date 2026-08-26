<template>
  <UIValidationErrors :full="full" :errors="errors">
    <div
      class="focus-within:border-green bg-light-100 border-light-200 flex w-full flex-nowrap items-center justify-between gap-4 border duration-300"
      :class="[computedSize.element, { 'disabled-element': disabled }]"
    >
      <NuxtIcon v-if="icon" :name="icon" :size="computedSize.icon" />
      <UIInputBase
        v-model="model"
        :name="name"
        :size="size"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :input-mode="inputMode"
        :placeholder="placeholder"
        :max-length="maxLength"
      />
      <UIMaxLengthCounter v-if="maxLength" :value-length="model.length" :max-length="maxLength" />
    </div>
  </UIValidationErrors>
</template>

<script setup lang="ts">
import { EIconSizeSmall } from '~/enums/global.enums';
import type { TSize, TUIComputedSizeMap, TUIInputAutocomplete, TUIInputMode } from '~/types/ui.types';

import UIInputBase from '~/components/ui/inputs/UIInputBase.vue';
import UIMaxLengthCounter from '~/components/ui/UIMaxLengthCounter.vue';
import UIValidationErrors from '~/components/ui/UIValidationErrors.vue';

const model = defineModel<string>({ required: true });

const props = withDefaults(
  defineProps<{
    name: string;
    icon?: string | null;
    size?: TSize;
    full?: boolean;
    disabled?: boolean;
    inputMode?: TUIInputMode;
    autocomplete?: TUIInputAutocomplete;
    placeholder?: string | undefined;
    maxLength?: number | null;
    errors?: string[] | null;
  }>(),
  {
    icon: null,
    size: 'medium',
    full: false,
    disabled: false,
    inputMode: 'text',
    autocomplete: 'off',
    placeholder: undefined,
    maxLength: null,
    errors: null,
  },
);

const computedSize = computed(() => {
  const size: TUIComputedSizeMap = {
    small: {
      element: 'h-24 py-4 px-8 text-12 rounded-4',
      icon: EIconSizeSmall.SMALL,
    },
    medium: {
      element: 'h-32 py-6 rounded-6 px-12 text-14',
      icon: EIconSizeSmall.MEDIUM,
    },
    large: {
      element: 'h-40 py-8 px-16 rounded-6 text-16',
      icon: EIconSizeSmall.LARGE,
    },
  };

  return size[props.size];
});
</script>
