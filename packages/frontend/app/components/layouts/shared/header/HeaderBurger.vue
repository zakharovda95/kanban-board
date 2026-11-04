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
        class="bg-light-100 absolute right-0 bottom-0 left-0 z-2 flex h-[calc(100dvh-80px)] flex-col justify-between gap-12 p-12"
      >
        <div class="flex w-full flex-col gap-12">
          <UIWidget>
            <HeaderNav />
          </UIWidget>

          <UIWidget v-if="!isAuthRoute && !userStore.isAuth">
            <LoginLink full />
          </UIWidget>

          <UIWidget v-if="userStore.isOwner" title="Мое пространство">
            <TheWorkspace />
          </UIWidget>

          <UIWidget v-if="userStore.isAuth" title="Мой профиль" body-class="flex flex-col gap-8">
            <TheProfile v-if="userStore.me" v-model:user="userStore.me" is-current-user />
            <LogoutButton v-if="!isAuthRoute && userStore.isAuth" full />
          </UIWidget>
        </div>

        <UIWidget body-class="flex w-full justify-between">
          <TheSettings :background-color="EColor.LIGHT_200" :color="EColor.LIGHT_800" size="large" />
          <TheAuthor />
          <TheSocial :size="EIconSizeLarge.LARGE" />
        </UIWidget>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import { EIconSizeLarge } from '~/enums/global.enums.ts';
import { useUserStore } from '~/stores/user.store.ts';

import HeaderNav from '~/components/layouts/shared/header/HeaderNav.vue';
import LoginLink from '~/components/layouts/shared/LoginLink.vue';
import LogoutButton from '~/components/layouts/shared/LogoutButton.vue';
import TheAuthor from '~/components/shared/TheAuthor.vue';
import TheProfile from '~/components/shared/TheProfile.vue';
import TheSettings from '~/components/shared/TheSettings.vue';
import TheSocial from '~/components/shared/TheSocial.vue';
import TheWorkspace from '~/components/shared/TheWorkspace.vue';
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIWidget from '~/components/ui/UIWidget.vue';

const route = useRoute();
const userStore = useUserStore();

const isBurgerOpen = ref(false);

const isAuthRoute = computed(() => route.name === 'auth');
</script>
