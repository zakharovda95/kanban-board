import type { EColor } from '@kanban-board/common';

export type TBaseAction =
  'update' | 'delete' | 'share' | 'copy' | 'setup' | 'moveToStart' | 'moveToEnd' | 'moveToPrevious' | 'moveToNext';

export type TUpsertFormData = {
  title: string;
  description: string;
  color?: string;
};

export type TBaseActionButtonData = {
  action: TBaseAction;
  icon: string;
  backgroundColor: EColor;
  color: EColor;
  iconClass?: string;
};
