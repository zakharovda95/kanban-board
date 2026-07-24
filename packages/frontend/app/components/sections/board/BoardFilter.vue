<template>
  <div class="rounded-12 bg-light-base flex h-fit w-full p-12">
    <div class="flex w-full">
      <UIButton prepend-icon="add-line" :size="ESize.MEDIUM"> Добавить колонку </UIButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ESize } from '~/enums/global.enums';

import UIButton from '~/components/ui/buttons/UIButton.vue';
</script>
