<template>
  <div class="flex flex-wrap gap-8">
    <UIBadge v-if="user.status">
      {{ USER_WORKSPACE_STATUS_MAP[user.status] }}
    </UIBadge>
    <UIBadge v-if="user.workspaceRole" :background-color="EColor.BLUE">
      {{ USER_WORKSPACE_ROLE_MAP[user.workspaceRole] }}
    </UIBadge>
    <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800">
      создан {{ DatetimeUtility.format(user.createdAt, 'DD.MM.YYYY HH:mm') }}
    </UIBadge>
  </div>
</template>

<script setup lang="ts">
import {
  DatetimeUtility,
  EColor,
  type TUser,
  USER_WORKSPACE_ROLE_MAP,
  USER_WORKSPACE_STATUS_MAP,
} from '@kanban-board/common';

import UIBadge from '~/components/ui/UIBadge.vue';

defineProps<{
  user: TUser;
}>();
</script>
