export function useIsMounted() {
  const isMounted = ref(false);
  onMounted(() => {
    isMounted.value = true;
  });

  onUnmounted(() => {
    isMounted.value = false;
  });

  return isMounted;
}
