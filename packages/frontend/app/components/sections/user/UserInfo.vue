<template>
  <div class="flex items-center justify-start gap-12">
    <TheAvatar :avatar="user.avatar" />
    <div class="flex flex-col gap-4">
      <span class="text-14 font-medium">{{ fullName }}</span>
      <span class="text-12 text-light-500 font-medium">{{ user.login }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TUserBase } from '@kanban-board/common';

import TheAvatar from '~/components/shared/TheAvatar.vue';

const props = defineProps<{
  user: TUserBase;
}>();

const fullName = computed(() => `${props.user.firstName} ${props.user.lastName}`);
</script>
