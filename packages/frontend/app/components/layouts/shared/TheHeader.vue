<template>
  <header class="flex h-80 items-center justify-center bg-transparent px-12 pt-12">
    <div class="bg-light-base rounded-12 flex size-full items-center justify-between px-12 py-8">
      <div class="flex h-full items-center gap-48">
        <TheLogo />

        <nav class="flex h-full items-center gap-4">
          <UILink :to="{ name: 'boards' }" icon="layout-7-line">Доски</UILink>
        </nav>
      </div>

      <TheAvatar v-if="false" />
    </div>
  </header>
</template>

<script setup lang="ts">
import TheAvatar from '~/components/shared/TheAvatar.vue';
import TheLogo from '~/components/shared/TheLogo.vue';
import UILink from '~/components/ui/links/UILink.vue';
</script>
