import { ColorUtils } from '@/libs/utils/color.utils';
import type { TNewColumn } from '@/modules/columns/libs/types/columns.types';

export const DEFAULT_COLUMN_TITLE = {
  ready: 'К выполнению',
  inProgress: 'В работе',
  done: 'Выполнено',
};

export const DEFAULT_COLUMNS: TNewColumn[] = [
  {
    title: DEFAULT_COLUMN_TITLE.ready,
    description: null,
    order: 1,
    color: ColorUtils.getRandomRgba(0.7),
  },
  {
    title: DEFAULT_COLUMN_TITLE.inProgress,
    description: null,
    order: 2,
    color: ColorUtils.getRandomRgba(0.7),
  },
  {
    title: DEFAULT_COLUMN_TITLE.done,
    description: null,
    order: 3,
    color: ColorUtils.getRandomRgba(0.7),
  },
];
