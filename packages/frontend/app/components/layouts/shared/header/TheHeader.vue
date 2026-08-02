<template>
  <header class="flex h-80 shrink-0 items-center justify-between gap-12 bg-transparent px-12 pt-12">
    <div
      class="bg-light-base rounded-12 flex size-full max-w-268 shrink-0 items-center justify-between gap-12 px-12 py-8"
    >
      <TheLogo show-version />
      <HeaderAppSettings />
    </div>

    <div class="bg-light-base rounded-12 flex h-full flex-1 items-center justify-between gap-24 px-48 py-8">
      <nav class="mb-4 flex items-center gap-36">
        <UILink to="/boards" :is-active="route.name === 'boards' || route.name === 'boards-id'">Доски</UILink>
        <UILink to="/docs" :is-active="route.name === 'docs'">Документация</UILink>
        <UILink to="/about" :is-active="route.name === 'about'">О проекте</UILink>
      </nav>

      <nav class="flex w-fit items-center justify-end gap-12">
        <UILink
          icon="icons:github"
          :tag="ETag.A"
          to="https://github.com/zakharovda95/kanban-board"
          target="_blank"
          :icon-size="32"
        />

        <UILink icon="icons:telegram" :tag="ETag.A" to="https://t.me/zakharovda95" target="_blank" :icon-size="32" />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ETag } from '~/enums/global.enums';

import HeaderAppSettings from '~/components/layouts/shared/header/HeaderAppSettings.vue';
import TheLogo from '~/components/shared/TheLogo.vue';
import UILink from '~/components/ui/UILink.vue';

const route = useRoute();
</script>
