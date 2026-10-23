import dayjs from 'dayjs';

import { TDatetimeFormat } from '../types/date-type.types.js';

export class DatetimeUtility {
  /** Строковое форматирование даты. **/
  public static format(date: Date | string | undefined, format: TDatetimeFormat): string {
    return dayjs(date).format(format);
  }

  /** Сколько прошло времени с указанной даты. **/
  public static getPassedSince(
    date: Date | string | undefined,
    unit: dayjs.ManipulateType,
  ): number {
    const targetDate = dayjs(date).startOf(unit);
    const today = dayjs().startOf(unit);
    return today.diff(targetDate, unit);
  }

  /** Добавляет значение к дате. **/
  public static add(
    date: Date | string | undefined,
    value: number,
    unit: dayjs.ManipulateType,
  ): Date {
    return dayjs(date).add(value, unit).toDate();
  }
}
