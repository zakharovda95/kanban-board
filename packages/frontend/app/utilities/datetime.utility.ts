import dayjs from 'dayjs';

export type TDatetimeFormat = 'YYYY-MM-DD' | 'DD.MM.YYYY';

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
