<template>
  <header class="border-b-light-300 bg-light-200 flex h-80 items-center justify-between border-b p-8">
    <div class="flex h-full items-center gap-48">
      <TheLogo />

      <div class="flex h-full items-center gap-4">
        <UILink :to="{ name: 'index' }" icon="layout-7-line" direction="row-reverse">Доски</UILink>
      </div>
    </div>

    <TheAvatar v-if="false" />
  </header>
</template>

<script setup lang="ts">
import TheAvatar from '~/components/shared/TheAvatar.vue';
import TheLogo from '~/components/shared/TheLogo.vue';
import UILink from '~/components/ui/links/UILink.vue';
</script>
