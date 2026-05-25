import type { TIssue } from '@/modules/issues/libs/issues.types';

export type TColumn = {
  id: number;
  title: string;
  description: string | null;
  order: number;
  issues: TIssue[];
};

export type TPatchColumn = Partial<Pick<TColumn, 'title' | 'description'>>;

export type TMoveColumn = {
  nextColumnId?: number;
  previousColumnId?: number;
};
