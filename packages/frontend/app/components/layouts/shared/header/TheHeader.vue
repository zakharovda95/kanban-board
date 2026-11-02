<template>
  <header class="flex h-80 shrink-0 items-center justify-between gap-12 bg-transparent px-12 pt-12">
    <UIWidget class="laptop:max-w-268 max-w-none" h-full>
      <div class="flex size-full shrink-0 items-center justify-between gap-12">
        <TheLogo show-version />
        <TheSettings class="laptop:block hidden" />
        <HeaderBurger class="laptop:hidden flex" />
      </div>
    </UIWidget>

    <UIWidget class="laptop:flex hidden" h-full>
      <div class="flex size-full flex-1 items-center justify-between gap-24 px-24">
        <HeaderNav />

        <div v-if="!isAuthRoute" class="flex gap-12">
          <LoginLink v-if="!userStore.isAuth" />
          <LogoutButton v-else />
        </div>
      </div>
    </UIWidget>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user.store.ts';

import HeaderBurger from '~/components/layouts/shared/header/HeaderBurger.vue';
import HeaderNav from '~/components/layouts/shared/header/HeaderNav.vue';
import LoginLink from '~/components/layouts/shared/LoginLink.vue';
import LogoutButton from '~/components/layouts/shared/LogoutButton.vue';
import TheLogo from '~/components/shared/TheLogo.vue';
import TheSettings from '~/components/shared/TheSettings.vue';
import UIWidget from '~/components/ui/UIWidget.vue';

const route = useRoute();
const userStore = useUserStore();

const isAuthRoute = computed(() => route.name === 'auth');
</script>
