import { IsHexColor, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { TCreateColumn } from '@/modules/column/libs/types/column.types';
import { ValidateIfDefinedAndNotNull } from '@/modules/libs/decorators/validation.decorators';

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
