<template>
  <div
    class="rounded-8 bg-light-100 hover:border-green flex size-full h-60 cursor-pointer items-center justify-start gap-24 border border-transparent p-8 duration-300 select-none"
    @click.stop="emit('card:click', $event)"
  >
    <UserInfo :user="user" />
  </div>
</template>

<script setup lang="ts">
import type { TUserBase } from '@kanban-board/common';

import UserInfo from '~/components/sections/user/UserInfo.vue';

defineProps<{
  user: TUserBase;
}>();

const emit = defineEmits<{
  'card:click': [event: MouseEvent];
}>();
</script>
