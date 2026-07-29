import type { EColor } from '@kanban-board/common';

export type TBaseAction = 'update' | 'delete' | 'move' | 'share' | 'copy' | 'setup';

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
