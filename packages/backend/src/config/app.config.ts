import { resolve } from 'node:path';

import { ENodeEnv } from '@kanban-board/common';
import { ConfigModuleOptions } from '@nestjs/config';
import { z } from 'zod';

import {
  MAX_DB_CONNECTIONS,
  MAX_PORT,
  MIN_DB_PASSWORD_LENGTH,
  MIN_LENGTH,
  MIN_PORT,
} from '@/config/libs/constants/app-config.constants';

export class AppConfig {
  private static MONOREPO_ROOT: string = resolve(__dirname, '../../../..');

  public static get appConfigSchema() {
    return z.object({
      NODE_ENV: z.enum(ENodeEnv),
      BACKEND_HOST: z.string().trim(),
      BACKEND_PORT: z.coerce.number().min(MIN_PORT).max(MAX_PORT),
      DB_HOST: z.string().min(1).trim(),
      DB_PORT: z.coerce.number().min(MIN_PORT).max(MAX_PORT),
      DB_NAME: z.string().min(MIN_LENGTH).trim(),
      DB_USER: z.string().min(MIN_LENGTH).trim(),
      DB_PASSWORD: z.string().min(MIN_DB_PASSWORD_LENGTH).trim(),
      DB_MAX: z.coerce.number().default(MAX_DB_CONNECTIONS),
    });
  }

  public static get appConfigOptions(): ConfigModuleOptions {
    return {
      envFilePath: resolve(this.MONOREPO_ROOT, `.env.${process.env.NODE_ENV}`),
      isGlobal: true,
      cache: true,
      validate: (envConfig: Record<string, unknown>): z.infer<typeof this.appConfigSchema> => {
        const result = this.appConfigSchema.safeParse(envConfig);
        if (!result.success) throw new Error(result.error.message);
        return result.data;
      },
      validationOptions: {
        allowUnknown: false,
        abortEarly: false, // прервать (и отобразить) только первую ошибку валидации
      },
    };
  }
}
