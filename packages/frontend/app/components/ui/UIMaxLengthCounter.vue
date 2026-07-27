<template>
  <div class="bg-light-300 rounded-4 flex size-fit items-center justify-center p-8">
    <output class="text-12 leading-0 font-medium" :class="{ 'text-red': computedLength <= 0 }">
      {{ computedLength }}
    </output>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  valueLength: number;
  maxLength: number;
}>();

const computedLength = computed(() => {
  if (props.valueLength >= props.maxLength) return 0;
  return Math.round(Number(props.maxLength) - Number(props.valueLength));
});
</script>
