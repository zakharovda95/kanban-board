export function useIsLaptop() {
  const { width } = useWindowSize();
  return computed(() => width.value >= 1024);
}
