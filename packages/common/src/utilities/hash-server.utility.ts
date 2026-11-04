import { createHash } from 'node:crypto';

/** Использовать только в серверной части, на клиенте будет ошибка из-за node:crypto. **/
export class HashServerUtility {
  /** SHA-256 в hex. Для случайного токена этого достаточно, чтобы хранить и искать хеш. **/
  public static sha256(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }
}
