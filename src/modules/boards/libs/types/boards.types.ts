import type { TSuccessResponse } from '@/libs/types/response.types';
import type { TColumn } from '@/modules/columns/libs/types/columns.types';

export type TBoard = {
  boardId: number;
  title: string;
  description: string | null;
  columns: TColumn[];
};

export type TCreateBoardResponse = TSuccessResponse<Pick<TBoard, 'boardId'>>;

export type TPatchBoard = Partial<Pick<TBoard, 'title' | 'description'>>;
