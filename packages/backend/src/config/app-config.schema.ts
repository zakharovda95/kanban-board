import { ENodeEnv } from '@kanban-board/common';
import { z } from 'zod';

const MIN_PORT = 1024;
const MAX_PORT = 49151;

/** Схема конфигурационного файла приложения. **/
export const appConfigSchema = z.object({
  NODE_ENV: z.enum(ENodeEnv),
  BACKEND_HOST: z.string().trim().min(4),
  BACKEND_PORT: z.coerce.number().min(MIN_PORT).max(MAX_PORT),
  FRONTEND_URL: z.string().trim().pipe(z.url()),
  WEBSOCKET_URL: z.string().trim().pipe(z.url()),
  DB_HOST: z.string().trim().min(4),
  DB_PORT: z.coerce.number().min(MIN_PORT).max(MAX_PORT),
  DB_NAME: z.string().trim().min(8),
  DB_USER: z.string().trim().min(4),
  DB_PASSWORD: z.string().trim().min(8),
  DB_POOL_SIZE: z.coerce.number().default(10),
});

/** Тип схемы конфигурационного файла приложения. **/
export type TAppConfigSchema = z.infer<typeof appConfigSchema>;
