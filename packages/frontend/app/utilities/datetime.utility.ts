import dayjs from 'dayjs';

import type { TDatetimeFormat } from '~/types/utilities.types';

// import 'dayjs/locale/ru.js';
// dayjs.locale('ru');

export class DatetimeUtility {
  public static format(date: Date, format: TDatetimeFormat): string {
    return dayjs(date).format(format);
  }

  public static getDaysPassedSince(date: Date): number {
    const targetDate = dayjs(date).startOf('day');
    const today = dayjs().startOf('day');
    return today.diff(targetDate, 'day');
  }
}
