export function useIsLaptop(options?: { onTrue?: () => void; onFalse?: () => void }) {
  const { width } = useWindowSize();
  const isLaptop = computed(() => width.value >= 1024);

  watch(isLaptop, (value: boolean, oldValue: boolean) => {
    if (value === oldValue) return;

    if (value && options?.onTrue) options.onTrue();
    else if (!value && options?.onFalse) options.onFalse();
  });

  return isLaptop;
}
