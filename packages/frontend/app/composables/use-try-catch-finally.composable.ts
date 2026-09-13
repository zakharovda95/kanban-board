import { type Ref, ref } from 'vue';
import type { FetchError } from 'ofetch';

export type TUseTryCatchFinallyOptions<TParams, TReturnData> = {
  callback: (params?: TParams, signal?: AbortSignal) => Promise<TReturnData | null>;
  catchCallback?: (error: unknown) => void;
  finallyCallback?: () => void;
  callOnInit?: boolean;
  useAbort?: boolean;
};

export function useTryCatchFinally<TReturnData, TParams = undefined>(
  options: TUseTryCatchFinallyOptions<TParams, TReturnData>,
) {
  let abortController: AbortController | null = null;
  const isLoading = ref(false);
  const data: Ref<TReturnData | null> = ref(null);

  const abort = () => {
    if (!abortController) return;
    abortController.abort();
    abortController = null;
  };

  const call = async (params?: TParams): Promise<void> => {
    let innerAbortController: AbortController | null = null;

    if (options.useAbort) {
      abort();
      abortController = new AbortController();
      innerAbortController = abortController;
    }
    try {
      isLoading.value = true;
      data.value = await options.callback(params, innerAbortController?.signal);
    } catch (error: unknown) {
      const errorData = (error as FetchError)?.response?._data?.data ?? null;

      if (options.catchCallback) options.catchCallback(errorData);
      else throw errorData;
    } finally {
      if (abortController === innerAbortController) {
        isLoading.value = false;
        abortController = null;
      }
      options.finallyCallback?.();
    }
  };

  if (options.callOnInit) void call();

  return { data, isLoading, call };
}
