<template>
  <Teleport to="#teleports">
    <div
      v-if="isOpen"
      class="size-screen bg-light-black-opacity absolute inset-0 flex items-center justify-center overflow-hidden p-12"
      @click="closeModal(closeOnOverlay)"
    >
      <Transition name="modal-showed" mode="out-in">
        <div v-if="isOpen" class="bg-light-base rounded-12 relative size-fit max-h-[80%] max-w-[80%] p-12">
          <header class="mb-8 flex items-center justify-between gap-8">
            <div v-if="title || slots.header" class="flex-1 font-medium">
              <slot name="header">
                {{ title }}
              </slot>
            </div>
            <UIIconButton
              class="bg-light-200 absolute right-0 bottom-[calc(100%+8px)]"
              icon="close-line"
              @click:button.stop="closeModal()"
            />
          </header>

          <div class="h-fit w-auto">
            <slot />
          </div>

          <footer v-if="slots.footer">
            <slot name="footer" />
          </footer>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const slots = defineSlots();

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    title?: string | null;
    closeOnOverlay?: boolean;
  }>(),
  {
    title: null,
    closeOnOverlay: true,
  },
);

const emit = defineEmits<{ 'update:is-open': [value: boolean] }>();

const closeModal = (canClose: boolean = true): void => {
  if (!canClose) return;
  emit('update:is-open', !props.isOpen);
};
</script>
