import { io } from 'socket.io-client';

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const socket = io(runtimeConfig.public.WEBSOCKET_URL, {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 5000,
    // коннектим не на старте приложения, а после входа в приложение, в ручную
    autoConnect: false,
  });

  return {
    provide: {
      socket,
    },
  };
});
