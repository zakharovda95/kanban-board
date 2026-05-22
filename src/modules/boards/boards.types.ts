import type { EBoardStatus } from '@/modules/boards/boards.enums';
import type { TColumn } from '@/modules/columns/columns.types';

export type TBoard = {
  id: number;
  title: string;
  description: string;
  order: number;
  limit: number;
  status: EBoardStatus;
  columns: TColumn[];
};

export type TUpdateBoard = Partial<Pick<TBoard, 'title' | 'description' | 'limit'>>;
