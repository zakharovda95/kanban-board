import { TSuccessResponse } from '@/libs/types/response.types';
import type { TIssue } from '@/modules/issues/libs/types/issues.types';

export type TColumnBase = {
  columnId: number;
  title: string;
  description: string | null;
  order: number;
  color: string;
  boardId: number;
};

export type TColumn = TColumnBase & {
  issues: TIssue[];
};

export type TCreateColumn = Pick<TColumnBase, 'title' | 'color' | 'boardId'> &
  Partial<Pick<TColumnBase, 'description'>>;

export type TCreateColumnResponse = TSuccessResponse<Pick<TColumnBase, 'columnId'>>;

export type TNewColumn = Pick<TColumnBase, 'title' | 'description' | 'order' | 'color'>;

export type TPatchColumn = Partial<Pick<TColumnBase, 'title' | 'description'>>;

export type TMoveColumn = {
  nextColumnId?: number;
  previousColumnId?: number;
};
