<template>
  <UIModal v-model:is-open="isOpen" :title="modalTitle" :close-on-overlay="false" :body-class="bodyClass">
    <div class="w-full min-w-320">
      <UIForm
        :disabled="disabled"
        :action-button-label="actionButtonLabel"
        :buttons-size="ESize.MEDIUM"
        full
        @submit:form="emit('click:action-button')"
        @reset:form="isOpen = false"
      >
        <UILabel text="Название">
          <UIInput
            v-model="model.title"
            :size="ESize.MEDIUM"
            :max-length="titleMaxlength"
            :errors="formErrors.title"
            name="input-title"
            placeholder="Укажите название..."
            full
          />
        </UILabel>

        <UILabel text="Описание">
          <Component
            :is="resolvedDescriptionComponent"
            v-model="model.description"
            :size="ESize.MEDIUM"
            :max-length="descriptionMaxlength"
            :errors="formErrors.description"
            name="input-description"
            placeholder="Укажите описание..."
            full
          />
        </UILabel>

        <UILabel v-if="showColorPicker && model.color" text="Цвет">
          <UIColorPicker v-model="model.color" :size="ESize.MEDIUM" />
        </UILabel>
      </UIForm>
    </div>
  </UIModal>
</template>

<script setup lang="ts">
import type { TValidationErrors } from '@kanban-board/common';

import { ACTION_BUTTON_LABEL } from '~/constants/ui.constants';
import { ESize } from '~/enums/global.enums';
import type { TUpsertFormData } from '~/types/shared.types';

import UIInput from '~/components/ui/inputs/UIInput.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';
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
  }>(),
  {
    bodyClass: null,
    disabled: false,
    titleMaxlength: null,
    descriptionMaxlength: null,
    actionButtonLabel: ACTION_BUTTON_LABEL,
    showColorPicker: false,
    descriptionComponent: 'input',
  },
);

const emit = defineEmits<{
  'click:action-button': [];
}>();

const resolvedDescriptionComponent = computed(() => (props.descriptionComponent === 'input' ? UIInput : UIRichEditor));
</script>
