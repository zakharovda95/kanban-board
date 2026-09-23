import { io } from 'socket.io-client';

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const socket = io(runtimeConfig.public.WEBSOCKET_URL, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 5000,
  });

  return {
    provide: {
      socket,
    },
  };
});
