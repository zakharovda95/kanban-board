import type { TIssue } from '@/modules/issues/libs/types/issues.types';

export type TColumn = {
  id: number;
  title: string;
  description: string | null;
  order: number;
  color: string;
  issues: TIssue[];
};

export type TPatchColumn = Partial<Pick<TColumn, 'title' | 'description'>>;

export type TMoveColumn = {
  nextColumnId?: number;
  previousColumnId?: number;
};
