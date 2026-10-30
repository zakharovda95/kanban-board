<template>
  <div>
    <UIIconButton
      :icon="isBurgerOpen ? 'mingcute:close-fill' : 'mingcute:menu-fill'"
      size="medium"
      :background-color="EColor.LIGHT_200"
      :color="EColor.LIGHT_800"
      @click:button="isBurgerOpen = !isBurgerOpen"
    />

    <Transition name="fade">
      <div
        v-if="isBurgerOpen"
        class="bg-light-100 absolute right-0 bottom-0 left-0 z-2 flex h-[calc(100dvh-80px)] items-center justify-center p-12"
      >
        <div class="bg-light-base rounded-12 flex size-full flex-col gap-24 p-12">
          <TheProfile />
          <UIDivider variant="dashed" />

          <div class="flex size-full flex-1 flex-col gap-24">
            <HeaderNav />

            <template v-if="!isAuthRoute">
              <UIDivider variant="dashed" />

              <div class="flex w-full flex-col gap-12">
                <LoginLink v-if="!authStore.isAuth" full />
                <LogoutButton v-else full />
              </div>
            </template>
          </div>

          <div class="flex w-full justify-between">
            <TheSettings :background-color="EColor.LIGHT_200" :color="EColor.LIGHT_800" size="large" />
            <TheSocial :size="EIconSizeLarge.LARGE" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { EIconSizeLarge } from '~/enums/global.enums.ts';
import { useAuthStore } from '~/stores/auth.store.ts';

import HeaderNav from '~/components/layouts/shared/header/HeaderNav.vue';
import LoginLink from '~/components/layouts/shared/LoginLink.vue';
import LogoutButton from '~/components/layouts/shared/LogoutButton.vue';
import TheProfile from '~/components/shared/TheProfile.vue';
import TheSettings from '~/components/shared/TheSettings.vue';
import TheSocial from '~/components/shared/TheSocial.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIDivider from '~/components/ui/UIDivider.vue';

const route = useRoute();
const authStore = useAuthStore();

const isBurgerOpen = ref(false);

const isAuthRoute = computed(() => route.name === 'auth');
</script>
