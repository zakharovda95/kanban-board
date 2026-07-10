<template>
  <div class="rounded-12 bg-light-base flex h-100 w-full p-16">
    <div class="flex w-full">
      <UIButton class="bg-green text-light-base" prepend-icon="add-line" :size="ESize.MEDIUM">Создать задачу</UIButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ESize } from '~/enums/global.enums';

import UIButton from '~/components/ui/buttons/UIButton.vue';
</script>
