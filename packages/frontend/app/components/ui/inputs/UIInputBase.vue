<template>
  <input
    v-model="model"
    class="text-light-800 w-full border-0 outline-0"
    :class="[computedSize.element]"
    :name="name"
    :disabled="disabled"
    :autocomplete="autocomplete"
    :inputmode="inputMode"
    :placeholder="placeholder"
    :maxlength="maxLength ?? undefined"
    :readonly="readonly"
    :type="type"
  >
</template>

<script setup lang="ts">
import type { TSize, TUIComputedSizeMap, TUIInputAutocomplete, TUIInputMode, TUIInputType } from '~/types/ui.types';

const model = defineModel<string>({ required: true });

const props = withDefaults(
  defineProps<{
    name: string;
    size?: TSize;
    disabled?: boolean;
    inputMode?: TUIInputMode;
    autocomplete?: TUIInputAutocomplete;
    placeholder?: string | undefined;
    maxLength?: number | null;
    readonly?: boolean;
    type?: TUIInputType;
  }>(),
  {
    size: 'medium',
    disabled: false,
    inputMode: 'text',
    autocomplete: 'off',
    placeholder: undefined,
    maxLength: null,
    readonly: false,
    type: 'text',
  },
);

const computedSize = computed(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: 'text-12',
    },
    medium: {
      element: 'text-14',
    },
    large: {
      element: 'text-16',
    },
  };

  return sizes[props.size];
});
</script>
