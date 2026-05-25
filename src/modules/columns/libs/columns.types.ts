import type { TIssue } from '@/modules/issues/libs/issues.types';

export type TColumn = {
  id: number;
  title: string;
  description: string | null;
  issues: TIssue[];
};

export type TPatchColumn = Partial<Pick<TColumn, 'title' | 'description'>>;
