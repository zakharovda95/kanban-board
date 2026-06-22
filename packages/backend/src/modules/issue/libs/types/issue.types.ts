import type { TSuccessResponse } from '@/libs/types/response.types';
import { TMoveParameters } from '@/modules/shared/move/libs/types/move.types';

export type TIssue = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string | null;
  order: number;
  boardId: number;
  columnId: number;
};

export type TCreateIssue = Pick<TIssue, 'title' | 'description'>;
export type TCreateIssueResponse = TSuccessResponse<Pick<TIssue, 'id'>>;

export type TMoveIssue = TMoveParameters & { toColumnId?: number };

export type TPatchIssue = Partial<Pick<TIssue, 'title' | 'description'>>;
