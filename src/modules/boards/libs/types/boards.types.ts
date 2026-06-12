import type { TSuccessResponse } from '@/libs/types/response.types';
import type { TColumn } from '@/modules/columns/libs/types/columns.types';

export type TBoardBase = {
  boardId: number;
  title: string;
  order: number;
  description: string | null;
};

export type TBoard = TBoardBase & {
  columns: TColumn[];
};

export type TCreateBoard = Pick<TBoardBase, 'title'> & Partial<Pick<TBoardBase, 'description'>>;
export type TCreateBoardResponse = TSuccessResponse<Pick<TBoard, 'boardId'>>;

export type TPatchBoard = Partial<Pick<TBoardBase, 'title' | 'description'>>;

export type TMoveBoard = {
  previousBoardId?: number | null;
  nextBoardId?: number | null;
};
