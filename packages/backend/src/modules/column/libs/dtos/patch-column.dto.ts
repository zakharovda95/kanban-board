import type { TPatchColumn } from '@kanban-board/common';
import { IsHexColor, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import {
  ValidateIfDefined,
  ValidateIfDefinedAndNotNull,
} from '@/libs/decorators/validation.decorators';

export class PatchColumnDto implements TPatchColumn {
  @ValidateIfDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  title?: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  description?: string | null;

  @ValidateIfDefined()
  @IsNotEmpty()
  @IsHexColor()
  color?: string;
}
