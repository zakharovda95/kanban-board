<template>
  <div>
    <UIIconButton
      :icon="isBurgerOpen ? 'mingcute:close-fill' : 'mingcute:menu-fill'"
      size="large"
      :background-color="EColor.LIGHT_200"
      :color="EColor.LIGHT_700"
      @click:button="isBurgerOpen = !isBurgerOpen"
    />

    <Transition name="fade">
      <div
        v-if="isBurgerOpen"
        class="bg-light-200 absolute right-0 bottom-0 left-0 z-2 flex h-[calc(100vh-80px)] items-center justify-center p-12"
      >
        <div class="bg-light-base rounded-12 flex size-full flex-col gap-24 p-12">
          <TheProfile />
          <UIDivider variant="dashed" />

          <div class="flex-1">
            <HeaderNav />
          </div>

          <div class="flex w-full justify-between">
            <TheSettings :background-color="EColor.LIGHT_200" :color="EColor.LIGHT_700" size="large" />
            <TheSocial :size="40" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import HeaderNav from '~/components/layouts/shared/header/HeaderNav.vue';
import TheProfile from '~/components/shared/TheProfile.vue';
import TheSettings from '~/components/shared/TheSettings.vue';
import TheSocial from '~/components/shared/TheSocial.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIDivider from '~/components/ui/UIDivider.vue';

const isBurgerOpen = ref(false);
</script>
