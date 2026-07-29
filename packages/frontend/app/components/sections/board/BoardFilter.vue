<template>
  <div class="rounded-12 bg-light-base flex h-56 w-full items-center p-12">
    <AddColumnButton @update:board="emit('update:board')" />
  </div>
</template>

<script setup lang="ts">
import AddColumnButton from '~/components/sections/column/AddColumnButton.vue';

const emit = defineEmits<{
  'update:board': [];
}>();
</script>
