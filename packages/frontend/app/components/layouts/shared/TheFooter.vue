<template>
  <footer class="flex h-72 shrink-0 items-center justify-center px-12 pb-12">
    <UIWidget h-full>
      <div class="flex size-full items-center justify-center gap-24">
        <div class="text-12 flex flex-col items-center justify-center">
          <span>Designed & developed by</span>
          <span class="text-green">{{ '\u00A9 zakharovda95' }}</span>
        </div>
        <TheSocial />
      </div>
    </UIWidget>
  </footer>
</template>

<script setup lang="ts">
import TheSocial from '~/components/shared/TheSocial.vue';
import UIWidget from '~/components/ui/UIWidget.vue';
</script>
