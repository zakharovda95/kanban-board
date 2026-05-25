import type { TUpdateBoard } from '@/modules/boards/libs/boards.types';

export class UpdateBoardDto implements TUpdateBoard {
  title?: string;
  description?: string | null;
  limit?: number | null;
  order?: number;
}
