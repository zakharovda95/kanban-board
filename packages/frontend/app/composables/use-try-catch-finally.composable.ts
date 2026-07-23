import { type Ref, ref } from 'vue';
import type { FetchError } from 'ofetch';

export function useTryCatchFinally<TReturnData, TParams = undefined>(options: {
  callback: (params?: TParams) => Promise<TReturnData | null>;
  catchCallback?: (error: unknown) => void;
  finallyCallback?: () => void;
  callOnInit?: boolean;
}): {
  data: Ref<TReturnData | null>;
  isLoading: Ref<boolean>;
  call: (params?: TParams) => Promise<void>;
} {
  const isLoading = ref(false);
  const data: Ref<TReturnData | null> = ref(null);

  const call = async (): Promise<void> => {
    try {
      isLoading.value = true;
      data.value = await options.callback();
    } catch (error: unknown) {
      const errorData = (error as FetchError)?.response?._data?.data ?? null;

      if (options.catchCallback) {
        options.catchCallback(errorData);
      } else {
        throw errorData;
      }
    } finally {
      if (options.finallyCallback) {
        options.finallyCallback();
      }

      isLoading.value = false;
    }
  };

  if (options.callOnInit) {
    void call();
  }

  return { data, isLoading, call };
}
