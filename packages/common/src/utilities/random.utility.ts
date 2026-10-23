import { randomBytes, randomInt } from 'node:crypto';

import { slugify } from 'transliteration';

export class RandomUtility {
  /** Получить случайный элемент из массива. **/
  public static getRandomFromArray<T>(array: T[]): T {
    return array[randomInt(array.length)];
  }

  /** Сгенерировать логин. **/
  public static generateRandomLogin(firstName: string, lastName: string): string {
    return `${slugify(`${firstName} ${lastName}`, { separator: '.', lowercase: true })}${randomInt(1000)}`;
  }

  /** Сгенерировать пароль. **/
  public static generateRandomPassword(size: number = 18): string {
    return `${randomBytes(size).toString('base64')}`;
  }
}
