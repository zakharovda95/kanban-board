import type { TSuccessResponse } from '@/libs/types/response.types';
import type { TColumn } from '@/modules/column/libs/types/column.types';

export type TBoardBase = {
  id: number;
  title: string;
  order: number;
  description: string | null;
};

export type TBoard = TBoardBase & {
  columns: TColumn[];
};

export type TCreateBoard = Pick<TBoardBase, 'title'> & Partial<Pick<TBoardBase, 'description'>>;
export type TCreateBoardResponse = TSuccessResponse<Pick<TBoardBase, 'id'>>;

export type TPatchBoard = Partial<Pick<TBoardBase, 'title' | 'description'>>;
