<template>
  <UIModal
    :title="modalTitle"
    :is-open="isOpen"
    :close-on-overlay="false"
    @update:is-open="emit('update:is-open', $event)"
  >
    <div class="flex w-320 flex-col gap-12">
      <UILabel text="Название">
        <UIInput
          v-model="model.title"
          :size="ESize.MEDIUM"
          :max-length="titleMaxlength"
          :disabled="isLoading"
          :errors="formErrors.title"
          name="input-title"
          placeholder="Укажите название..."
          full
        />
      </UILabel>
      <UILabel text="Описание">
        <UIInput
          v-model="model.description"
          :size="ESize.MEDIUM"
          :max-length="descriptionMaxlength"
          :disabled="isLoading"
          :errors="formErrors.description"
          name="input-description"
          placeholder="Укажите описание..."
          full
        />
      </UILabel>

      <slot v-if="slots.default" />
    </div>

    <template #footer>
      <div class="flex w-full flex-col gap-8">
        <UIButton
          full
          :size="ESize.MEDIUM"
          :is-loading="isLoading"
          :disabled="isLoading"
          @click:button="emit('click:action-button')"
        >
          {{ actionButtonLabel }}
        </UIButton>
        <UIButton
          full
          :size="ESize.MEDIUM"
          :background-color="EColor.RED"
          :is-loading="isLoading"
          :disabled="isLoading"
          @click:button="emit('update:is-open', false)"
        >
          Отмена
        </UIButton>
      </div>
    </template>
  </UIModal>
</template>

<script setup lang="ts">
import { EColor, type TValidationErrors } from '@kanban-board/common';

import { ESize } from '~/enums/global.enums';
import type { TUpsertFormData } from '~/types/shared.types';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';
import UILabel from '~/components/ui/UILabel.vue';

const slots = defineSlots();

const model = defineModel<TUpsertFormData>({ required: true });

withDefaults(
  defineProps<{
    modalTitle: string;
    formErrors: TValidationErrors<TUpsertFormData>;
    isOpen: boolean;
    isLoading?: boolean;
    disabled?: boolean;
    titleMaxlength?: number | null;
    descriptionMaxlength?: number | null;
    actionButtonLabel?: string;
  }>(),
  {
    isLoading: false,
    disabled: false,
    titleMaxlength: null,
    descriptionMaxlength: null,
    actionButtonLabel: 'Применить',
  },
);

const emit = defineEmits<{
  'click:action-button': [];
  'update:is-open': [value: boolean];
}>();
</script>
