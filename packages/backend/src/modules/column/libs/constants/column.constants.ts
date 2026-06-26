import { ColorUtility, type TNewColumn } from '@kanban-board/common';

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
