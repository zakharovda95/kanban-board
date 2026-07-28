import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import type { TDatetimeFormat } from '~/types/utilities.types';

import 'dayjs/locale/ru.js';

dayjs.locale('ru');

export class DatetimeUtility {
  public static format(date: Date | Dayjs, format: TDatetimeFormat): string {
    return dayjs(date).format(format);
  }

  public static getDaysPassedSince(date: Date | Dayjs): number {
    const currentDate = dayjs(date);
    const today = dayjs();
    return currentDate.diff(today, 'day');
  }
}
