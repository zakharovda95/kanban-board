<template>
  <Multiselect
    :id="name"
    v-model="model"
    class="ui-select"
    :class="[`ui-select--${size}`, { 'disabled-element': disabled }]"
    :content-wrapper-class="['ui-select-dropdown', `ui-select-dropdown--${size}`]"
    :options="options"
    :show-labels="false"
    :close-on-select="closeOnSelect"
    :searchable="searchable"
    :disabled="disabled"
    :multiple="multiple"
    use-teleport
    teleport-target="body"
    track-by="id"
    label="label"
    :placeholder="placeholder"
  />
</template>

<script setup lang="ts">
import Multiselect from 'vue-multiselect';

import type { TSize, TUISelectOption } from '~/types/ui.types.ts';

const model = defineModel<TUISelectOption>({ required: true });

withDefaults(
  defineProps<{
    name: string;
    options: TUISelectOption[];
    size?: TSize;
    closeOnSelect?: boolean;
    searchable?: boolean;
    placeholder?: string;
    disabled?: boolean;
    multiple?: boolean;
  }>(),
  {
    size: 'medium',
    closeOnSelect: true,
    searchable: false,
    placeholder: 'Выберите значение...',
    disabled: false,
    multiple: false,
  },
);
</script>

<style scoped>
.ui-select {
  color: var(--color-light-800);
  box-sizing: border-box;
}

.ui-select--small {
  min-height: 24px;
  font-size: 12px;
}

.ui-select--medium {
  min-height: 32px;
  font-size: 14px;
}

.ui-select--large {
  min-height: 40px;
  font-size: 16px;
}

.ui-select :deep(.multiselect__tags) {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-light-200);
  background: var(--color-light-100);
  transition: border-color 0.3s;
}

.ui-select--small :deep(.multiselect__tags) {
  height: 24px;
  min-height: 24px;
  padding: 0 24px 0 8px;
  border-radius: 4px;
  font-size: 12px;
}

.ui-select--medium :deep(.multiselect__tags) {
  height: 32px;
  min-height: 32px;
  padding: 0 32px 0 12px;
  border-radius: 6px;
  font-size: 14px;
}

.ui-select--large :deep(.multiselect__tags) {
  height: 40px;
  min-height: 40px;
  padding: 0 40px 0 16px;
  border-radius: 6px;
  font-size: 16px;
}

.ui-select--small.multiselect--active :deep(.multiselect__tags) {
  border-radius: 4px;
}

.ui-select--medium.multiselect--active :deep(.multiselect__tags),
.ui-select--large.multiselect--active :deep(.multiselect__tags) {
  border-radius: 6px;
}

.ui-select:focus-within :deep(.multiselect__tags),
.ui-select.multiselect--active :deep(.multiselect__tags) {
  border-color: var(--color-green);
}

.ui-select :deep(.multiselect__single),
.ui-select :deep(.multiselect__input) {
  margin: 0;
  padding: 0;
  min-height: auto;
  line-height: 1.25;
  background: transparent;
  color: var(--color-light-800);
  font-size: inherit;
  border-radius: 0;
}

.ui-select :deep(.multiselect__input::placeholder) {
  color: var(--color-light-400);
}

.ui-select :deep(.multiselect__placeholder) {
  margin: 0;
  padding: 0;
  color: var(--color-light-400);
}

.ui-select :deep(.multiselect__select) {
  top: 0;
  right: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.ui-select--small :deep(.multiselect__select) {
  width: 24px;
  height: 24px;
}

.ui-select--medium :deep(.multiselect__select) {
  width: 32px;
  height: 32px;
}

.ui-select--large :deep(.multiselect__select) {
  width: 40px;
  height: 40px;
}

.ui-select :deep(.multiselect__select::before) {
  top: auto;
  margin-top: 0;
  border-width: 5px 5px 0;
  border-color: var(--color-light-500) transparent transparent;
}

.ui-select--small :deep(.multiselect__select::before) {
  border-width: 4px 4px 0;
}

.ui-select :deep(.multiselect__tag) {
  margin: 0 4px 0 0;
  padding: 2px 22px 2px 8px;
  border-radius: 4px;
  background: var(--color-green);
  color: var(--color-light-base);
  font-size: 12px;
  line-height: 16px;
}

.ui-select :deep(.multiselect__tag-icon) {
  border-radius: 4px;
  line-height: 20px;
}

.ui-select :deep(.multiselect__tag-icon::after) {
  color: var(--color-light-base);
}
</style>

<style>
.ui-select-dropdown {
  margin-top: 4px;
  border: 1px solid var(--color-light-200) !important;
  border-radius: 6px !important;
  background: var(--color-light-base);
  box-shadow: none;
  overflow: auto;
}

.ui-select-dropdown--small {
  border-radius: 4px !important;
}

.ui-select-dropdown .multiselect__content {
  padding: 4px;
}

.ui-select-dropdown .multiselect__option {
  border-radius: 4px;
  color: var(--color-light-800);
  line-height: 1.25;
  white-space: nowrap;
}

.ui-select-dropdown--small .multiselect__option {
  min-height: 24px;
  padding: 4px 8px;
  font-size: 12px;
}

.ui-select-dropdown--medium .multiselect__option {
  min-height: 32px;
  padding: 6px 12px;
  font-size: 14px;
}

.ui-select-dropdown--large .multiselect__option {
  min-height: 40px;
  padding: 8px 16px;
  font-size: 16px;
}

.ui-select-dropdown .multiselect__option::after {
  display: none;
}

.ui-select-dropdown .multiselect__option--highlight {
  background: var(--color-green);
  color: var(--color-light-base);
}

.ui-select-dropdown .multiselect__option--selected {
  background: var(--color-light-100);
  color: var(--color-light-800);
  font-weight: 500;
}

.ui-select-dropdown .multiselect__option--selected.multiselect__option--highlight {
  background: var(--color-red);
  color: var(--color-light-base);
}
</style>
