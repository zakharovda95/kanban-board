import { EColor, type TColumnBase } from '@kanban-board/common';

export const DEFAULT_COLUMNS: Pick<TColumnBase, 'title' | 'description' | 'order' | 'color'>[] = [
  {
    title: 'К выполнению',
    description: null,
    order: 1000,
    color: EColor.BLUE,
  },
  {
    title: 'В работе',
    description: null,
    order: 2000,
    color: EColor.GREEN,
  },
  {
    title: 'Выполнено',
    description: null,
    order: 3000,
    color: EColor.ORANGE,
  },
];
