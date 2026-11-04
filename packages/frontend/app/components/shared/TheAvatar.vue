<template>
  <div :class="full || canEditAvatar ? 'w-full' : 'w-fit'">
    <div class="flex w-full flex-col items-center justify-center gap-4">
      <div class="flex shrink-0 items-center justify-center overflow-hidden" :class="computedSize.element">
        <img class="size-full" alt="Аватар пользователя" :src="`/images/${avatar ?? 'no-avatar'}.png`" >
      </div>

      <div v-if="canEditAvatar" class="flex gap-8">
        <UIIconButton
          :icon="isAvatarMenuOpen ? 'mingcute:arrows-up-line' : 'mingcute:arrows-down-line'"
          size="small"
          :background-color="isAvatarMenuOpen ? EColor.GREEN : EColor.BLUE"
          @click:button="toggleAvatarMenu"
        />
        <UIIconButton
          icon="mingcute:delete-2-line"
          size="small"
          :background-color="EColor.RED"
          @click:button="model = null"
        />
      </div>
    </div>
    <UIAnimatedHeight>
      <div v-if="isAvatarMenuOpen" class="w-full">
        <div class="my-12 grid grid-cols-[repeat(auto-fit,minmax(44px,1fr))] place-items-center gap-8">
          <button
            v-for="avatarEl in USER_AVATARS"
            :key="avatarEl"
            type="button"
            class="size-44 shrink-0 cursor-pointer bg-none duration-300 outline-none hover:scale-110"
            @click.stop="model = avatarEl"
          >
            <img class="size-full" alt="Аватар пользователя" :src="`/images/${avatarEl}.png`" >
          </button>
        </div>
      </div>
    </UIAnimatedHeight>
  </div>
</template>

<script setup lang="ts">
import { EColor, USER_AVATARS } from '@kanban-board/common';

import type { TSize, TUIComputedSize, TUIComputedSizeMap } from '~/types/ui.types.ts';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';

const model = defineModel<string | null>('avatar', { required: true });

const props = withDefaults(
  defineProps<{
    size?: TSize;
    canEditAvatar?: boolean;
    full?: boolean;
  }>(),
  {
    size: 'medium',
    canEditAvatar: false,
    full: false,
  },
);

const computedSize = computed<TUIComputedSize>(() => {
  const sizes: TUIComputedSizeMap = {
    small: {
      element: 'size-24',
    },
    medium: {
      element: 'size-44',
    },
    large: {
      element: 'size-64',
    },
  };

  return sizes[props.size] ?? sizes.small;
});

const isAvatarMenuOpen = ref(false);

const toggleAvatarMenu = () => {
  if (!props.canEditAvatar) return;
  isAvatarMenuOpen.value = !isAvatarMenuOpen.value;
};
</script>
