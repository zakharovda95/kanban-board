<template>
  <div class="rounded-12 bg-light-base flex h-fit w-full p-12">
    <AddColumnButton @update:columns="emit('update:columns')" />
  </div>
</template>

<script setup lang="ts">
import AddColumnButton from '~/components/sections/column/AddColumnButton.vue';

const emit = defineEmits<{
  'update:columns': [];
}>();
</script>
