<template>
  <header class="border-b-light-300 bg-light-200 flex h-80 items-center justify-between border-b p-12">
    <TheLogo />

    <div>
      <UILink>Доски</UILink>
    </div>
  </header>
</template>

<script setup lang="ts">
import TheLogo from '~/components/shared/TheLogo.vue';
import UILink from '~/components/ui/links/UILink.vue';
</script>
