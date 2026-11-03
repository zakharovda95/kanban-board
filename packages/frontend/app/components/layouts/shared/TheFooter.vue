<template>
  <footer class="flex h-72 shrink-0 items-center justify-center px-12 pb-12">
    <UIWidget h-full body-class="flex items-center justify-center gap-24">
      <TheAuthor />
      <TheSocial />
    </UIWidget>
  </footer>
</template>

<script setup lang="ts">
import TheAuthor from '~/components/shared/TheAuthor.vue';
import TheSocial from '~/components/shared/TheSocial.vue';
import UIWidget from '~/components/ui/UIWidget.vue';
</script>
