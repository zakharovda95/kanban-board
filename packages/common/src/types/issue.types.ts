import type { IMovable, TMoveParameters } from './move.types.js';
import type { TSuccessResponse } from './response.types.js';

export type TIssueBase = IMovable & {
  createdAt: Date;
  title: string;
  boardId: number;
  columnId: number;
};

export type TIssue = TIssueBase & {
  updatedAt: Date;
  description: string | null;
};

export type TCreateIssue = Pick<TIssue, 'title' | 'description'>;
export type TCreateIssueResponse = TSuccessResponse<Pick<TIssue, 'id'>>;

export type TMoveIssue = TMoveParameters & { toColumnId?: number };

export type TPatchIssue = Partial<Pick<TIssue, 'title' | 'description'>>;
