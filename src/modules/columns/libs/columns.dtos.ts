import type { TMoveColumn, TPatchColumn } from '@/modules/columns/libs/columns.types';

export class PatchColumnDto implements TPatchColumn {
  title?: string;
  description?: string | null;
}

export class MoveColumnDto implements TMoveColumn {
  previousColumnId?: number;
  nextColumnId?: number;
}
