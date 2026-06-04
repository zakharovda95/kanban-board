import { ConfigModuleOptions } from '@nestjs/config';
import { z } from 'zod';

import { ENodeEnv } from '@/libs/enums/app.enums';

const MIN_LENGTH = 1;
const MIN_PORT = 1;
const MAX_PORT = 65535;
const MIN_DB_PASSWORD_LENGTH = 8;

export const DEFAULT_HOST = 'localhost';
export const DEFAULT_PORT = 3000;

export const MAX_DB_CONNECTIONS = 10;

export const appConfigSchema = z.object({
  NODE_ENV: z.enum(ENodeEnv),
  HOST: z.string().trim().default(DEFAULT_HOST),
  PORT: z.coerce.number().min(MIN_PORT).max(MAX_PORT).default(DEFAULT_PORT),
  DB_HOST: z.string().min(MIN_LENGTH).trim(),
  DB_PORT: z.coerce.number().min(MIN_PORT).max(MAX_PORT),
  DB_NAME: z.string().min(MIN_LENGTH).trim(),
  DB_USER: z.string().min(MIN_LENGTH).trim(),
  DB_PASSWORD: z.string().min(MIN_DB_PASSWORD_LENGTH).trim(),
  DB_MAX: z.coerce.number().default(MAX_DB_CONNECTIONS),
});

export const APP_CONFIG_OPTIONS: ConfigModuleOptions = {
  envFilePath: `.env.${process.env.NODE_ENV}`,
  isGlobal: true,
  ignoreEnvFile: false, // игнорит .env.* файлы (переменные не попадут в configService.get())
  skipProcessEnv: false, // игнорит process.env (переменные не попадут в configService.get())
  cache: true,
  validate: (envConfig: Record<string, unknown>): z.infer<typeof appConfigSchema> => {
    const result = appConfigSchema.safeParse(envConfig);
    if (!result.success) throw new Error(result.error.message);
    return result.data;
  },
  validationOptions: {
    allowUnknown: false,
    abortEarly: false, // прервать (и отобразить) только первую ошибку валидации
  },
};
