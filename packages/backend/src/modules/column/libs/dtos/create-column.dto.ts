import type { TCreateColumn } from '@kanban-board/common';
import { IsHexColor, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export class CreateColumnDto implements TCreateColumn {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  @MaxLength(128)
  description?: string | null;

  @IsHexColor()
  color: string;
}
