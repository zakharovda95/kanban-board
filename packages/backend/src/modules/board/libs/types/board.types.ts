import type { TSuccessResponse } from '@kanban-board/common';

import type { TColumn } from '@/modules/column/libs/types/column.types';
import type { IMovable } from '@/modules/shared/move/libs/types/move.types';

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
