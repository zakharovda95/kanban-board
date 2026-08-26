<template>
  <UIModal v-model:is-open="isOpen" :title="modalTitle" :body-class="bodyClass">
    <UIForm
      :disabled="disabled"
      :action-button-label="actionButtonLabel"
      :buttons-position="buttonsPosition"
      full
      @submit:form="emit('click:action-button')"
      @reset:form="isOpen = false"
    >
      <UILabel text="Название" required>
        <UIInput
          :model-value="model.title"
          :max-length="titleMaxlength"
          :errors="formErrors.title"
          name="input-title"
          placeholder="Укажите название..."
          full
          @update:model-value="updateModel('title', $event)"
        />
      </UILabel>

      <UILabel text="Описание" :tag="descriptionComponent === 'editor' ? 'div' : 'label'">
        <Component
          :is="resolvedDescriptionComponent"
          v-model="model.description"
          :max-length="descriptionMaxlength"
          :errors="formErrors.description"
          name="input-description"
          placeholder="Укажите описание..."
          editor-class="max-h-[50vh]"
          full
        />
      </UILabel>

      <UILabel v-if="showColorPicker && model.color" text="Цвет" required>
        <UIColorPicker :model-value="model.color" @update:model-value="updateModel('color', $event)" />
      </UILabel>
    </UIForm>
  </UIModal>
</template>

<script setup lang="ts">
import type { TValidationErrors } from '@kanban-board/common';

import { ACTION_BUTTON_LABEL } from '~/constants/ui.constants';
import type { TUpsertFormData } from '~/types/shared.types';
import type { TUIFormButtonsPosition } from '~/types/ui.types.ts';

import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';
import UIColorPicker from '~/components/ui/UIColorPicker.vue';
import UIForm from '~/components/ui/UIForm.vue';
import UILabel from '~/components/ui/UILabel.vue';
import UIRichEditor from '~/components/ui/UIRichEditor.vue';

const model = defineModel<TUpsertFormData>({ required: true });
const isOpen = defineModel<boolean>('isOpen', { required: true });

const props = withDefaults(
  defineProps<{
    bodyClass?: string | null;
    modalTitle: string;
    formErrors: TValidationErrors<TUpsertFormData>;
    disabled?: boolean;
    titleMaxlength?: number | null;
    descriptionMaxlength?: number | null;
    actionButtonLabel?: string;
    showColorPicker?: boolean;
    descriptionComponent?: 'input' | 'editor';
    buttonsPosition?: TUIFormButtonsPosition;
  }>(),
  {
    bodyClass: null,
    disabled: false,
    titleMaxlength: null,
    descriptionMaxlength: null,
    actionButtonLabel: ACTION_BUTTON_LABEL,
    showColorPicker: false,
    descriptionComponent: 'input',
    buttonsPosition: 'column',
  },
);

const emit = defineEmits<{
  'click:action-button': [];
  'update:field': [field: keyof TUpsertFormData, value: TUpsertFormData[keyof TUpsertFormData]];
}>();

const resolvedDescriptionComponent = computed(() => (props.descriptionComponent === 'input' ? UIInput : UIRichEditor));

const updateModel = (field: keyof TUpsertFormData, value: TUpsertFormData[keyof TUpsertFormData]) => {
  emit('update:field', field, value);
};
</script>
