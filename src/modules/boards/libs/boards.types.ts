import type { TColumn } from '@/modules/columns/libs/columns.types';

export type TBoard = {
  id: number;
  title: string;
  description: string | null;
  columns: TColumn[];
};

export type TPatchBoard = Partial<Pick<TBoard, 'title' | 'description'>>;
