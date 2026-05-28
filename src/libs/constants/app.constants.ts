import { ConfigModuleOptions } from '@nestjs/config';

export const DEFAULT_PORT = 3000;

export const APP_CONFIG_OPTIONS: ConfigModuleOptions = {
  envFilePath: `.env.${process.env.NODE_ENV}`,
  isGlobal: true,
  // игнорит .env.* файлы (переменные не попадут в configService.get())
  ignoreEnvFile: false,
  // игнорит process.env (переменные не попадут в configService.get())
  skipProcessEnv: false,
};
