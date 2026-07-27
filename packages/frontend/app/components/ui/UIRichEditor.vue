<template>
  <UIValidationErrors :full="full" :errors="errors">
    <div class="flex size-full flex-col items-end gap-4">
      <textarea
        v-model="model"
        class="bg-light-200 rounded-8 focus:border-green block max-h-320 min-h-150 w-auto max-w-640 min-w-150 border border-transparent p-12 outline-none"
        :class="{ 'w-full!': full }"
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
import type { TUIInputAutocomplete, TUIInputMode } from '~/types/ui.types';

import UIValidationErrors from '~/components/ui/UIValidationErrors.vue';

const model = defineModel<string>({ required: true });

withDefaults(
  defineProps<{
    name: string;
    full?: boolean;
    disabled?: boolean;
    inputMode?: TUIInputMode;
    autocomplete?: TUIInputAutocomplete;
    placeholder?: string | undefined;
    maxLength?: number | null;
    errors?: string[] | null;
  }>(),
  {
    full: false,
    disabled: false,
    inputMode: 'text',
    autocomplete: 'off',
    placeholder: undefined,
    maxLength: null,
    errors: null,
  },
);
</script>
