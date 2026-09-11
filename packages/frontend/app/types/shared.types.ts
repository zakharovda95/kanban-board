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
  handler: () => void | Promise<void>;
  iconClass?: string;
  disabled: boolean;
};

/** Нагрузка события change у vuedraggable. **/
export type TDragChangeDetails<T> = {
  added?: {
    element: T;
    newIndex: number;
  };
  removed?: {
    element: T;
    oldIndex: number;
  };
  moved?: {
    element: T;
    oldIndex: number;
    newIndex: number;
  };
};
