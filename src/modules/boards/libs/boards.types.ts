import type { EBoardStatus } from '@/modules/boards/libs/boards.enums';
import type { TColumn } from '@/modules/columns/libs/columns.types';

export type TBoard = {
  id: number;
  title: string;
  description: string | null;
  order: number;
  limit: number | null;
  status: EBoardStatus;
  columns: TColumn[];
};

export type TUpdateBoard = Partial<Pick<TBoard, 'title' | 'description' | 'limit' | 'order'>>;
