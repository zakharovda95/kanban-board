import { randomBytes } from 'node:crypto';

/** Использовать только в серверной части, на клиенте будет ошибка из-за node:crypto. **/
export class RandomServerUtility {
  /** Сгенерировать пароль. **/
  public static generateRandomPassword(
    size: number = 18,
    encoding: BufferEncoding = 'base64',
  ): string {
    return randomBytes(size).toString(encoding);
  }
}
