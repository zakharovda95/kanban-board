<template>
  <UIModal
    :title="isCreateMode ? 'Создать новую доску' : 'Редактировать доску'"
    :is-open="isOpen"
    :close-on-overlay="false"
    @update:is-open="closeModal($event)"
  >
    <div class="flex w-full max-w-320 min-w-280 flex-col gap-12">
      <UILabel text="Название">
        <UIInput
          :model-value="formData.title!"
          :size="ESize.MEDIUM"
          :max-length="BOARD_TITLE_MAXLENGTH"
          :disabled="isLoading"
          name="input-title"
          placeholder="Укажите название доски..."
          full
          @update:model-value="update('title', $event)"
        />
      </UILabel>

      <UILabel text="Описание">
        <UIInput
          :model-value="formData.description!"
          :size="ESize.MEDIUM"
          :max-length="BOARD_DESCRIPTION_MAXLENGTH"
          :disabled="isLoading"
          name="input-description"
          placeholder="Укажите описание доски..."
          full
          @update:model-value="update('description', $event)"
        />
      </UILabel>

      <div class="flex w-full flex-col gap-8">
        <UIButton
          class="bg-green! text-light-base!"
          full
          :size="ESize.MEDIUM"
          :is-loading="isLoading"
          :disabled="isLoading"
          @click:button="upsertBoard"
        >
          Создать
        </UIButton>
        <UIButton
          class="bg-red! text-light-base!"
          full
          :size="ESize.MEDIUM"
          :is-loading="isLoading"
          :disabled="isLoading"
          @click:button="closeModal(false)"
        >
          Отмена
        </UIButton>
      </div>
    </div>
  </UIModal>
</template>

<script setup lang="ts">
import {
  BOARD_DESCRIPTION_MAXLENGTH,
  BOARD_TITLE_MAXLENGTH,
  type TCreateBoard,
  type TPatchBoard,
} from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import { ESize } from '~/enums/global.enums';
import type { TUpsertMode } from '~/types/shared.types';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UILabel from '~/components/ui/UILabel.vue';
import UIModal from '~/components/ui/UIModal.vue';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    mode?: TUpsertMode;
  }>(),
  { mode: 'create' },
);

const emit = defineEmits<{ 'update:is-open': [value: boolean] }>();

const isCreateMode = computed(() => props.mode === 'create');

const { formData, update, reset } = useForm<TCreateBoard | TPatchBoard>({ title: '', description: '' });

const { isLoading, call: upsertBoard } = useTryCatchFinally({
  callback: async () => {
    const result = await $fetch('/api/boards', { method: isCreateMode.value ? 'POST' : 'PATCH', body: formData.value });
    console.log(result);
    closeModal(false);
  },
});

const closeModal = (value: boolean) => {
  emit('update:is-open', value);
  reset();
};
</script>
