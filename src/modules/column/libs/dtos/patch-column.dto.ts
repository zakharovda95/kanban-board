import { IsHexColor, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import type { TPatchColumn } from '@/modules/column/libs/types/column.types';
import { ValidateIfDefined } from '@/modules/libs/decorators/validation.decorators';

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
