<template>
  <Component
    :is="tag"
    class="bg-light-300 text-light-800 rounded-4 flex h-42 w-fit cursor-pointer flex-row flex-nowrap items-center justify-center gap-4 px-24 whitespace-nowrap duration-300 outline-none hover:brightness-95"
    :class="{ 'w-full!': full }"
    @click="emit('click:button', $event)"
  >
    <NuxtIcon v-if="prependIcon" :name="`mingcute:${prependIcon}`" :size="prependIconSize" />
    <slot />
    <NuxtIcon v-if="appendIcon" :name="`mingcute:${appendIcon}`" :size="appendIconSize" />
  </Component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: 'button' | 'div' | 'span';
    prependIcon?: string | null;
    prependIconSize?: number;
    appendIcon?: string | null;
    appendIconSize?: number;
    isLoading?: boolean;
    full?: boolean;
  }>(),
  {
    tag: 'button',
    prependIcon: null,
    prependIconSize: 16,
    appendIcon: null,
    appendIconSize: 16,
    isLoading: false,
    full: false,
  },
);

const emit = defineEmits<{ 'click:button': [event: MouseEvent] }>();
</script>
