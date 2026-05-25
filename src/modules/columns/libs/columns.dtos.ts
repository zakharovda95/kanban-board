import type { TPatchColumn } from '@/modules/columns/libs/columns.types';

export class PatchColumnDto implements TPatchColumn {
  title?: string;
  description?: string | null;
}
