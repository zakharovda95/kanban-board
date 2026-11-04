import dayjs from 'dayjs';

import { EDateTimeComparison } from '../enums/date-time.enums.js';
import { TDatetimeFormat } from '../types/date-time.types.js';

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

  /**
   * Сравнивает первую дату со второй по признаку: больше, меньше или равны.
   * @param firstDate - первая дата.
   * @param secondDate - вторая дата.
   * @param comparison - признак сравнения.
   * @returns true, если даты соотносятся по указанному признаку.
   * **/
  public static compareDates(
    firstDate: Date | string,
    secondDate: Date | string,
    comparison: EDateTimeComparison,
  ): boolean {
    const first = dayjs(firstDate);
    const second = dayjs(secondDate);

    switch (comparison) {
      case EDateTimeComparison.GREATER:
        return first.isAfter(second);
      case EDateTimeComparison.LESS:
        return first.isBefore(second);
      case EDateTimeComparison.EQUAL:
        return first.isSame(second);
      default:
        return false;
    }
  }
}
