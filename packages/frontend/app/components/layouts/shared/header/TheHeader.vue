<template>
  <header class="flex h-80 shrink-0 items-center justify-between gap-12 bg-transparent px-12 pt-12">
    <div
      class="bg-light-base rounded-12 laptop:max-w-268 flex size-full max-w-none shrink-0 items-center justify-between gap-12 px-12 py-8"
    >
      <TheLogo show-version />
      <TheSettings class="laptop:block hidden" />
      <HeaderBurger class="laptop:hidden flex" />
    </div>

    <div
      class="bg-light-base rounded-12 laptop:flex hidden h-full flex-1 items-center justify-between gap-24 px-48 py-8"
    >
      <HeaderNav />

      <div v-if="!isAuthRoute" class="flex gap-12">
        <LoginLink v-if="!authStore.isAuth" />
        <LogoutButton v-else />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store.ts';

import HeaderBurger from '~/components/layouts/shared/header/HeaderBurger.vue';
import HeaderNav from '~/components/layouts/shared/header/HeaderNav.vue';
import LoginLink from '~/components/layouts/shared/LoginLink.vue';
import LogoutButton from '~/components/layouts/shared/LogoutButton.vue';
import TheLogo from '~/components/shared/TheLogo.vue';
import TheSettings from '~/components/shared/TheSettings.vue';

const route = useRoute();
const authStore = useAuthStore();

const isAuthRoute = computed(() => route.name === 'auth');
</script>
