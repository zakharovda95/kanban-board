<template>
  <UIValidationErrors :full="full" :errors="errors">
    <div class="flex size-full flex-col items-end gap-4">
      <textarea
        v-model="model"
        class="bg-light-200 focus:border-green block max-h-320 min-h-150 w-full min-w-150 border border-transparent outline-none"
        :class="[{ 'w-full!': full }, computedSize.element]"
        :style="{ scrollbarWidth: 'none' }"
        :disabled="disabled"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :maxlength="maxLength ?? undefined"
        :inputmode="inputMode"
        :name="name"
      />
      <UIMaxLengthCounter v-if="maxLength" :value-length="model.length" :max-length="maxLength" />
    </div>
  </UIValidationErrors>
</template>

<script setup lang="ts">
import { ESize } from '~/enums/global.enums';
import type { TUIComputedSizeMap, TUIInputAutocomplete, TUIInputMode } from '~/types/ui.types';

import UIValidationErrors from '~/components/ui/UIValidationErrors.vue';

const model = defineModel<string>({ required: true });

const props = withDefaults(
  defineProps<{
    name: string;
    full?: boolean;
    size?: ESize;
    disabled?: boolean;
    inputMode?: TUIInputMode;
    autocomplete?: TUIInputAutocomplete;
    placeholder?: string | undefined;
    maxLength?: number | null;
    errors?: string[] | null;
  }>(),
  {
    full: false,
    size: ESize.SMALL,
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
      element: 'p-8 text-14 rounded-4',
    },
    medium: {
      element: 'p-12 rounded-6 text-16',
    },
    large: {
      element: 'p-16 rounded-6 text-18',
    },
  };

  return size[props.size];
});
</script>
