import { isSuccessResponse } from '@kanban-board/common';

export function useSocket() {
  const { $socket } = useNuxtApp();

  const isLoading = ref(false);

  const emitEvent = <TData, TAckReturnValue>({
    event,
    timeout = 10000,
    data,
    successCallback,
    errorCallback,
  }: {
    event: string;
    timeout?: number;
    data: TData;
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
    const handler = (data: TData) => {
      callback(data);
    };
    $socket?.on(event, handler);

    return () => $socket.off(event, handler);
  };

  return { listen, emitEvent, isLoading, $socket };
}
