import { IsHexColor, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import type { TPatchColumn } from '@/modules/column/libs/types/column.types';

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

  @ValidateIfDefined()
  @IsNotEmpty()
  @IsHexColor()
  color?: string;
}
