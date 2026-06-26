import type { TSuccessResponse } from '@kanban-board/common';

import type { TColumn } from './column.types.js';
import type { IMovable } from './move.types.js';

export type TBoardBase = IMovable & {
  title: string;
  description: string | null;
};

export type TBoard = TBoardBase & {
  columns: TColumn[];
};

export type TCreateBoard = Pick<TBoardBase, 'title'> & Partial<Pick<TBoardBase, 'description'>>;
export type TCreateBoardResponse = TSuccessResponse<Pick<TBoardBase, 'id'>>;

export type TPatchBoard = Partial<Pick<TBoardBase, 'title' | 'description'>>;
