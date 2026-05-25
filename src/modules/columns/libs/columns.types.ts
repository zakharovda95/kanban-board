import type { EColumnStatus } from '@/modules/columns/libs/columns.enums';
import type { TIssue } from '@/modules/issues/libs/issues.types';

export type TColumn = {
  id: number;
  title: string;
  description: string | null;
  order: number;
  limit: number | null;
  status: EColumnStatus;
  color: string;
  issues: TIssue[];
};

export type TUpdateColumn = Partial<
  Pick<TColumn, 'title' | 'description' | 'color' | 'limit' | 'order'>
>;
