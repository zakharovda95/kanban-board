import { type Ref, ref } from 'vue';

export function useTryCatchFinally<TReturnData, TParams>(options: {
  callback: (params?: TParams) => TReturnData | null;
  catchCallback?: () => void;
  finallyCallback?: () => void;
  callOnInit?: boolean;
}): {
  data: Ref<TReturnData | null>;
  isLoading: Ref<boolean>;
  call: (params?: TParams) => void;
} {
  const isLoading = ref(false);
  const data: Ref<TReturnData | null> = ref(null);

  const call = () => {
    data.value = options.callback() ?? null;
  };

  try {
    isLoading.value = true;
    if (options.callOnInit) call();
  } catch (error: unknown) {
    if (options.catchCallback) options.catchCallback();
    else throw error;
  } finally {
    if (options.finallyCallback) options.finallyCallback();
    isLoading.value = false;
  }

  return { data, isLoading, call };
}
