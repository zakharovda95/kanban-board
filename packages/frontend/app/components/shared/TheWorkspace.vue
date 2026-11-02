<template>
  <div class="size-full">
    <UIButton full @click:button="isModalOpen = true">Настроить пространство</UIButton>
    <UIModal v-model:is-open="isModalOpen" close-on-overlay title="Настроить пространство">
      <div class="bg-light-200 rounded-12 text-14 flex flex-col items-center justify-center p-20">
        Тут будут настройки пространства
      </div>
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import UIButton from '~/components/ui/buttons/UIButton.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';

const isModalOpen = ref(false);
</script>
