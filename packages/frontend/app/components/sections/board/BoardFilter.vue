<template>
  <div class="rounded-12 bg-light-base flex h-56 w-full items-center p-12">
    <AddColumnButton @add:column="emit('add:column', $event)" />
  </div>
</template>

<script setup lang="ts">
import type { TColumn } from '@kanban-board/common';

import AddColumnButton from '~/components/sections/column/AddColumnButton.vue';

const emit = defineEmits<{
  'add:column': [column: TColumn];
}>();
</script>
