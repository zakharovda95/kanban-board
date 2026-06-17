import { ColorUtility } from '@/libs/utilities/color.utility';
import type { TNewColumn } from '@/modules/column/libs/types/column.types';

export const DEFAULT_COLUMNS: TNewColumn[] = [
  {
    title: 'К выполнению',
    description: null,
    order: 1000,
    color: ColorUtility.getRandomHexColor(),
  },
  {
    title: 'В работе',
    description: null,
    order: 2000,
    color: ColorUtility.getRandomHexColor(),
  },
  {
    title: 'Выполнено',
    description: null,
    order: 3000,
    color: ColorUtility.getRandomHexColor(),
  },
];
