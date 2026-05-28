import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import type { TMoveColumn } from '@/modules/columns/libs/types/columns.types';

export class MoveColumnDto implements TMoveColumn {
  @ValidateIfDefined()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  previousColumnId?: number;

  @ValidateIfDefined()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  nextColumnId?: number;
}
