<template>
  <div class="flex w-full flex-col gap-8">
    <span class="text-14">
      Пользователи
      <span class="font-semibold" :class="isMaxUsersCount ? 'text-red' : 'text-green'">
        {{ users.length }} / {{ WORKSPACE_USERS_MAX_COUNT - users.length }}
      </span>
    </span>
    <div v-if="users.length" class="flex flex-col gap-12">
      <TheProfile v-for="user in users" :key="user.id" :user="user" />
    </div>
    <div v-else class="flex items-center gap-8">
      <span class="text-14">Нет активных пользователей</span>
      <UITooltip text="Вы можете пригласить пользователя в пространство, сгенерировав инвайт-ссылку." size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type TUser, WORKSPACE_USERS_MAX_COUNT } from '@kanban-board/common';

import TheProfile from '~/components/sections/profile/TheProfile.vue';
import UITooltip from '~/components/ui/UITooltip.vue';

const props = defineProps<{
  users: TUser[];
}>();

const isMaxUsersCount = computed(() => props.users.length === WORKSPACE_USERS_MAX_COUNT);
</script>
