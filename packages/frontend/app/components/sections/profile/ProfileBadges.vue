<template>
  <div class="flex flex-wrap gap-8">
    <UIBadge v-if="user.userWorkspace.status">
      {{ USER_WORKSPACE_STATUS_MAP[user.userWorkspace.status] }}
    </UIBadge>
    <UIBadge v-if="user.userWorkspace.workspaceRole" :background-color="EColor.BLUE">
      {{ USER_WORKSPACE_ROLE_MAP[user.userWorkspace.workspaceRole] }}
    </UIBadge>
    <UIBadge :background-color="EColor.LIGHT_300" :color="EColor.LIGHT_800">
      создан {{ DatetimeUtility.format(user.userWorkspace.createdAt, 'DD.MM.YYYY HH:mm') }}
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
