import { EColor, type TNewColumn } from '@kanban-board/common';

export const DEFAULT_COLUMNS: TNewColumn[] = [
  {
    title: 'К выполнению',
    description: null,
    order: 1000,
    color: EColor.ORANGE,
  },
  {
    title: 'В работе',
    description: null,
    order: 2000,
    color: EColor.BLUE,
  },
  {
    title: 'Выполнено',
    description: null,
    order: 3000,
    color: EColor.GREEN,
  },
];
