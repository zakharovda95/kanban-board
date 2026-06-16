import { IsHexColor, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';
import { TCreateColumn } from '@/modules/columns/libs/types/columns.types';

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

  @IsInt()
  @IsPositive()
  boardId: number;
}
