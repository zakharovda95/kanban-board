<template>
  <UIModal header="Создание доски" :is-open="isOpen" :close-on-overlay="false" @update:is-open="closeModal($event)">
    <div class="flex w-full max-w-320 min-w-280 flex-col gap-12">
      <UILabel text="Название">
        <UIInput
          :model-value="formData.title"
          :size="ESize.MEDIUM"
          :max-length="BOARD_TITLE_MAXLENGTH"
          name="input-title"
          placeholder="Название доски..."
          full
          @update:model-value="update('title', $event)"
        />
      </UILabel>

      <UILabel text="Описание">
        <UIInput
          :model-value="formData.description!"
          :size="ESize.MEDIUM"
          :max-length="BOARD_DESCRIPTION_MAXLENGTH"
          name="input-description"
          placeholder="Описание доски..."
          full
          @update:model-value="update('description', $event)"
        />
      </UILabel>

      <div class="flex w-full flex-col gap-4">
        <UIButton class="bg-green! text-light-base!" full :size="ESize.MEDIUM" @click:button="createBoard">
          Создать
        </UIButton>
        <UIButton class="bg-red! text-light-base!" full :size="ESize.MEDIUM" @click:button="closeModal(false)">
          Отмена
        </UIButton>
      </div>
    </div>
  </UIModal>
</template>

<script setup lang="ts">
import { BOARD_DESCRIPTION_MAXLENGTH, BOARD_TITLE_MAXLENGTH, type TCreateBoard } from '@kanban-board/common';

import { useForm } from '~/composables/use-form.composable';
import { ESize } from '~/enums/global.enums';

import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UILabel from '~/components/ui/UILabel.vue';
import UIModal from '~/components/ui/UIModal.vue';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{ 'update:is-open': [value: boolean] }>();

const { formData, update, reset } = useForm<TCreateBoard>({ title: '', description: '' });

const isLoading = ref(false);
const createBoard = async () => {
  try {
    isLoading.value = true;
    const result = await $fetch('/api/boards', { method: 'POST', body: formData.value });
    console.log(result);
    reset();
    emit('update:is-open', false);
  } catch (error: unknown) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const closeModal = (value: boolean) => {
  emit('update:is-open', value);
  reset();
};
</script>
