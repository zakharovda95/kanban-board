import { resolve } from 'node:path';

import { ENodeEnv } from '@kanban-board/common';
import { ConfigModuleOptions } from '@nestjs/config';
import { z } from 'zod';

export default class AppConfig {
  private static MONOREPO_ROOT: string = resolve(__dirname, '../../../..');
  private static MIN_PORT = 1;
  private static MAX_PORT = 65535;
  private static MIN_DB_PASSWORD_LENGTH = 8;
  private static MAX_DB_CONNECTIONS = 10;
  private static MIN_LENGTH = 1;

  public static get appConfigSchema() {
    return z.object({
      NODE_ENV: z.enum(ENodeEnv),
      BACKEND_HOST: z.string().trim().min(this.MIN_LENGTH),
      BACKEND_PORT: z.coerce.number().min(this.MIN_PORT).max(this.MAX_PORT),
      WEBSOCKET_URL: z.string().trim().min(this.MIN_LENGTH),
      DB_HOST: z.string().trim().min(this.MIN_LENGTH),
      DB_PORT: z.coerce.number().min(this.MIN_PORT).max(this.MAX_PORT),
      DB_NAME: z.string().trim().min(this.MIN_LENGTH),
      DB_USER: z.string().trim().min(this.MIN_LENGTH),
      DB_PASSWORD: z.string().trim().min(this.MIN_DB_PASSWORD_LENGTH),
      DB_MAX: z.coerce.number().default(this.MAX_DB_CONNECTIONS),
      MINIO_ACCESS_KEY: z.string().trim().min(this.MIN_LENGTH),
      MINIO_SECRET_KEY: z.string().trim().min(this.MIN_DB_PASSWORD_LENGTH),
      MINIO_BUCKET: z.string().trim().min(this.MIN_LENGTH),
      MINIO_PUBLIC_URL: z.string().trim().min(this.MIN_LENGTH),
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
        abortEarly: false,
      },
    };
  }
}
