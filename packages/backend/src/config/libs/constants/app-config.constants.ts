import { VersioningOptions, VersioningType } from '@nestjs/common';

export const MIN_PORT = 1;
export const MAX_PORT = 65535;
export const MIN_DB_PASSWORD_LENGTH = 8;
export const MAX_DB_CONNECTIONS = 10;
export const MIN_LENGTH = 1;
export const GLOBAL_API_PREFIX = 'api';

export const VERSIONING_OPTIONS: VersioningOptions = {
  type: VersioningType.URI,
  prefix: 'v',
  defaultVersion: '1',
};
