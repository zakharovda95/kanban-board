<template>
  <header class="flex h-80 items-center justify-between gap-12 bg-transparent px-12 pt-12">
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
      <TheSocial />
    </div>
  </header>
</template>

<script setup lang="ts">
import HeaderBurger from '~/components/layouts/shared/header/HeaderBurger.vue';
import HeaderNav from '~/components/layouts/shared/header/HeaderNav.vue';
import TheLogo from '~/components/shared/TheLogo.vue';
import TheSettings from '~/components/shared/TheSettings.vue';
import TheSocial from '~/components/shared/TheSocial.vue';
</script>
