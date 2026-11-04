<template>
  <header class="flex h-80 shrink-0 items-center justify-between gap-12 bg-transparent px-12 pt-12">
    <UIWidget class="laptop:max-w-268 max-w-none" h-full body-class="flex shrink-0 items-center justify-between gap-12">
      <TheLogo show-version />
      <TheSettings class="laptop:block hidden" />
      <HeaderBurger class="laptop:hidden flex" />
    </UIWidget>

    <UIWidget class="laptop:flex hidden" h-full body-class="flex flex-1 items-center justify-between gap-24 px-24">
      <HeaderNav />
      <LoginLink v-if="!isAuthRoute && !userStore.isAuth" />
    </UIWidget>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user.store.ts';

import HeaderBurger from '~/components/layouts/shared/header/HeaderBurger.vue';
import HeaderNav from '~/components/layouts/shared/header/HeaderNav.vue';
import LoginLink from '~/components/layouts/shared/LoginLink.vue';
import TheLogo from '~/components/shared/TheLogo.vue';
import TheSettings from '~/components/shared/TheSettings.vue';
import UIWidget from '~/components/ui/UIWidget.vue';

const route = useRoute();
const userStore = useUserStore();

const isAuthRoute = computed(() => route.name === 'auth');
</script>
