/**
 * CORS для Socket.IO разрешаем общий origin и разрешаем credentials (cookie сессии).
 * **/
export const WS_CORS_OPTIONS = {
  origin: true,
  credentials: true,
} as const;
