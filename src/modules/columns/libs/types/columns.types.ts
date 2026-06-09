import type { TIssue } from '@/modules/issues/libs/types/issues.types';

export type TColumn = {
  columnId: number;
  title: string;
  description: string | null;
  order: number;
  color: string;
  boardId: number;
  issues: TIssue[];
};

export type TNewColumn = Pick<TColumn, 'title' | 'description' | 'order' | 'color'>;

export type TPatchColumn = Partial<Pick<TColumn, 'title' | 'description'>>;

export type TMoveColumn = {
  nextColumnId?: number;
  previousColumnId?: number;
};
