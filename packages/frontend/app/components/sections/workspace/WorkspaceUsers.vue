<template>
  <div class="flex w-full flex-col gap-8">
    <span class="text-14">
      Пользователи
      <span class="font-semibold" :class="users.available <= 0 ? 'text-red' : 'text-green'">
        {{ users.occupied }} / {{ users.total }}
      </span>
    </span>
    <div v-if="users.users.length" class="flex flex-col gap-12">
      <OtherProfile v-for="user in users.users" :key="user.id" :user="user" @refresh="emit('refresh')" />
    </div>
    <div v-else class="flex items-center gap-8">
      <span class="text-14">Нет активных пользователей</span>
      <UITooltip text="Вы можете пригласить пользователя в пространство, сгенерировав инвайт-ссылку." size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TWorkspaceUsers } from '@kanban-board/common';

import OtherProfile from '~/components/sections/profile/OtherProfile.vue';
import UITooltip from '~/components/ui/UITooltip.vue';

defineProps<{
  users: TWorkspaceUsers;
}>();

const emit = defineEmits<{
  'refresh': [];
}>();
</script>
