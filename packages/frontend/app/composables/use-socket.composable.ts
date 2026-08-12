import { isSuccessResponse } from '@kanban-board/common';

export function useSocket() {
  const { $socket } = useNuxtApp();

  const isLoading = ref(false);

  const emitEvent = <TAckReturnValue>({
    event,
    timeout = 10000,
    data,
    successCallback,
    errorCallback,
  }: {
    event: string;
    timeout?: number;
    data: unknown;
    successCallback: (data: TAckReturnValue) => void;
    errorCallback?: (error: unknown) => void;
  }) => {
    isLoading.value = true;
    $socket?.timeout(timeout).emit(event, data, (error: unknown, returnValue: TAckReturnValue) => {
      isLoading.value = false;

      if (error) {
        errorCallback?.(new Error(`Сокет-соединение не отвечает`));
        return;
      }

      if (isSuccessResponse(returnValue)) {
        successCallback?.(returnValue);
        return;
      }

      errorCallback?.(returnValue);
    });
  };

  const listen = <TData>(event: string, callback: (data: TData) => void) => {
    $socket?.on(event, (data: TData) => {
      callback(data);
    });
  };

  return { listen, emitEvent, isLoading };
}
