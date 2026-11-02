<template>
  <div
    class="bg-light-base flex flex-col items-start justify-start"
    :class="[
      wFull ? 'w-full' : 'w-fit',
      hFull ? 'h-full' : 'h-fit',
      computedSize.element,
      { 'cursor-pointer': pointer },
    ]"
    @click="emit('click:widget', $event)"
  >
    <h4 v-if="title" class="font-medium" :class="computedText.element">{{ title }}</h4>
    <div class="size-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TSize, TUIComputedSizeMap } from '~/types/ui.types.ts';

const props = withDefaults(
  defineProps<{
    title?: string | null;
    wFull?: boolean;
    hFull?: boolean;
    pointer?: boolean;
    size?: TSize;
  }>(),
  {
    title: null,
    wFull: true,
    hFull: false,
    pointer: false,
    size: 'medium',
  },
);

const emit = defineEmits<{
  'click:widget': [event: MouseEvent];
}>();

const computedSize = computed(() => {
  const size: TUIComputedSizeMap = {
    small: {
      element: 'gap-8 p-8 rounded-8',
    },
    medium: {
      element: 'gap-12 p-12 rounded-12',
    },
    large: {
      element: 'gap-16 p-16 rounded-16',
    },
  };

  return size[props.size];
});

const computedText = computed(() => {
  const size: TUIComputedSizeMap = {
    small: {
      element: 'text-14',
    },
    medium: {
      element: 'text-16',
    },
    large: {
      element: 'text-18',
    },
  };

  return size[props.size];
});
</script>
