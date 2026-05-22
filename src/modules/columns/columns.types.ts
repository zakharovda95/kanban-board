import { TIssue } from '@/modules/issues/issues.types';

export type TColumn = {
  id: number;
  title: string;
  description: string;
  order: number;
  limit: number;
  isArchived: boolean;
  issues: TIssue[];
};
