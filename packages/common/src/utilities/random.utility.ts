import { slugify } from 'transliteration';

export class RandomUtility {
  /** Получить случайный элемент из массива. **/
  public static getRandomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /** Сгенерировать логин. **/
  public static generateRandomLogin(firstName: string, lastName: string): string {
    return `${slugify(`${firstName} ${lastName}`, { separator: '.', lowercase: true })}${Math.floor(Math.random() * 1000)}`;
  }
}
