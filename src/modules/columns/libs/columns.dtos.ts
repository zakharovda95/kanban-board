import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import type { TMoveColumn, TPatchColumn } from '@/modules/columns/libs/columns.types';

export class PatchColumnDto implements TPatchColumn {
  @ValidateIfDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  title?: string;

  @ValidateIfDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  description?: string | null;
}

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
