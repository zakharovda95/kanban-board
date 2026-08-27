import type { EColor } from '@kanban-board/common';

export type TUpsertFormData = {
  title: string;
  description: string;
  color?: string;
};

export type TAction =
  'update' | 'delete' | 'share' | 'copy' | 'setup' | 'moveToStart' | 'moveToEnd' | 'moveToPrevious' | 'moveToNext';

export type TActionButtonData = {
  action: TAction;
  icon: string;
  backgroundColor: EColor;
  color: EColor;
  iconClass?: string;
};
