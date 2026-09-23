import { throttle } from 'lodash';

const DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30 сек
const THROTTLE_TIMEOUT = 5_000;

export function useAfkWatcher(handler: () => void, timeoutMilliseconds: number = DEFAULT_TIMEOUT): void {
  let afkTimeoutId: ReturnType<typeof setTimeout> | null = null;

  const armAfkTimer = () => {
    if (afkTimeoutId != null) clearTimeout(afkTimeoutId);
    afkTimeoutId = setTimeout(handler, timeoutMilliseconds);
  };

  const onActivity = throttle(armAfkTimer, THROTTLE_TIMEOUT);

  onMounted(() => {
    armAfkTimer();
    document.addEventListener('click', onActivity);
    document.addEventListener('mousemove', onActivity);
  });

  onBeforeUnmount(() => {
    onActivity.cancel();
    if (afkTimeoutId != null) clearTimeout(afkTimeoutId);
    document.removeEventListener('click', onActivity);
    document.removeEventListener('mousemove', onActivity);
  });
}
