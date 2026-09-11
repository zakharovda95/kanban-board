<template>
  <Multiselect
    v-model="model"
    :class="{ 'disabled-element': disabled }"
    :options="options"
    :show-labels="false"
    :close-on-select="closeOnSelect"
    :searchable="searchable"
    :disabled="disabled"
    track-by="id"
    label="label"
    :placeholder="placeholder"
  />
</template>

<script setup lang="ts">
import Multiselect from 'vue-multiselect';

import type { TUISelectOption } from '~/types/ui.types.ts';

const model = defineModel<TUISelectOption>({ required: true });

withDefaults(
  defineProps<{
    options: TUISelectOption[];
    closeOnSelect?: boolean;
    searchable?: boolean;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    closeOnSelect: true,
    searchable: false,
    placeholder: 'Выберите значение...',
    disabled: false,
  },
);
</script>
