<template>
  <header class="flex h-80 items-center justify-between gap-12 bg-transparent px-12 pt-12">
    <div
      class="bg-light-base rounded-12 flex size-full max-w-[calc(280px-12px)] items-center justify-center gap-12 px-12 py-8"
    >
      <TheLogo />
      <span class="text-12 text-green font-semibold">v.{{ runtimeConfig.public.VERSION }}</span>
    </div>

    <div class="bg-light-base rounded-12 flex h-full flex-1 items-center justify-between gap-24 px-12 py-8">
      <nav class="mb-4 flex items-center gap-24">
        <UILink to="/boards" :is-active="route.name === 'boards' || route.name === 'boards-id'">Доски</UILink>
        <UILink to="/about" :is-active="route.name === 'about'">О проекте</UILink>
      </nav>

      <div class="flex w-fit items-center justify-end gap-12">
        <UILink
          icon="github-line"
          :tag="ETag.A"
          to="https://github.com/zakharovda95/kanban-board"
          target="_blank"
          :icon-size="32"
        />
        <HeaderAppSettings />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ETag } from '~/enums/global.enums';

import HeaderAppSettings from '~/components/layouts/shared/header/HeaderAppSettings.vue';
import TheLogo from '~/components/shared/TheLogo.vue';
import UILink from '~/components/ui/links/UILink.vue';

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
</script>
