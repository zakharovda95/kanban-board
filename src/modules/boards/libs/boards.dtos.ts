import type { TPatchBoard } from '@/modules/boards/libs/boards.types';

export class PatchBoardDto implements TPatchBoard {
  title?: string;
  description?: string | null;
}
