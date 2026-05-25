import type { TUpdateColumn } from '@/modules/columns/libs/columns.types';

export class UpdateColumnDto implements TUpdateColumn {
  title?: string;
  description?: string | null;
  order?: number;
  limit?: number | null;
  color?: string;
}
