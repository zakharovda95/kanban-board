import type { TSuccessResponse } from '@kanban-board/common';

import type { TIssue } from '@/modules/issue/libs/types/issue.types';
import type { IMovable } from '@/modules/shared/move/libs/types/move.types';

export type TColumnBase = IMovable & {
  title: string;
  description: string | null;
  color: string;
  boardId: number;
};

export type TColumn = TColumnBase & {
  issues: TIssue[];
};

export type TCreateColumn = Pick<TColumnBase, 'title' | 'color'> &
  Partial<Pick<TColumnBase, 'description'>>;

export type TCreateColumnResponse = TSuccessResponse<Pick<TColumnBase, 'id'>>;

export type TNewColumn = Pick<TColumnBase, 'title' | 'description' | 'order' | 'color'>;

export type TPatchColumn = Partial<Pick<TColumnBase, 'title' | 'description'>>;
