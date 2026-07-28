import type { TSuccessResponse } from '@kanban-board/common';

import type { IMovable, TMoveParameters } from './move.types.js';

export type TIssue = IMovable & {
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string | null;
  boardId: number;
  columnId: number;
};

export type TCreateIssue = Pick<TIssue, 'title' | 'description'>;
export type TCreateIssueResponse = TSuccessResponse<Pick<TIssue, 'id'>>;

export type TMoveIssue = TMoveParameters & { toColumnId?: number };

export type TPatchIssue = Partial<Pick<TIssue, 'title' | 'description'>>;
